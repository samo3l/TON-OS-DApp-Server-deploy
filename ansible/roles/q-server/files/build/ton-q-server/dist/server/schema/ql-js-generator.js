"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _gen = require("./gen.js");

var _dbSchemaTypes = require("./db-schema-types");

function main(schemaDef) {
  const {
    types: dbTypes,
    enumTypes
  } = (0, _dbSchemaTypes.parseDbSchema)(schemaDef); // Generators

  const g = new _gen.Writer();
  const js = new _gen.Writer();

  function genGDoc(prefix, doc) {
    if (doc.trim() === '') {
      return;
    }

    const lines = doc.split(/\n\r?|\r\n?/);

    if (lines.length === 1 && !lines[0].includes('"')) {
      g.writeLn(prefix, '"', lines[0], '"');
    } else {
      g.writeLn(prefix, '"""');
      lines.forEach(line => {
        g.writeLn(prefix, line);
      });
      g.writeLn(prefix, '"""');
    }
  }

  function unionVariantType(type, variant) {
    return `${type.name}${variant.name}Variant`;
  }

  function genGTypeDeclarationsForUnionVariants(type) {
    type.fields.forEach(variant => {
      g.writeBlockLn(`
        type ${unionVariantType(type, variant)} {
            ${variant.name}: ${variant.type.name}
        }

        `);
    });
  }

  function genGEnumTypes() {
    for (const enumDef of enumTypes.values()) {
      g.writeLn(`enum ${enumDef.name}Enum {`);
      Object.keys(enumDef.values).forEach(name => {
        g.writeLn(`    ${(0, _dbSchemaTypes.toEnumStyle)(name)}`);
      });
      g.writeLn(`}`);
      g.writeLn();
    }
  }

  function genGTypeDeclaration(type) {
    if (type.category === _dbSchemaTypes.DbTypeCategory.union) {
      genGTypeDeclarationsForUnionVariants(type);
      g.writeLn(`union ${type.name} = `);
      type.fields.forEach(variant => {
        g.writeLn(`\t| ${unionVariantType(type, variant)}`);
      });
      g.writeLn();
    } else {
      genGDoc('', type.doc);
      g.writeLn(`type ${type.name} {`);
      type.fields.forEach(field => {
        genGDoc('\t', field.doc);
        const typeDeclaration = '['.repeat(field.arrayDepth) + field.type.name + ']'.repeat(field.arrayDepth);
        let params = '';

        if ((0, _dbSchemaTypes.isBigInt)(field.type)) {
          params = '(format: BigIntFormat)';
        } else if (field.join) {
          params = `(timeout: Int, when: ${type.name}Filter)`;
        }

        g.writeLn(`\t${field.name}${params}: ${typeDeclaration}`);
        const enumDef = field.enumDef;

        if (enumDef) {
          g.writeLn(`\t${field.name}_name: ${enumDef.name}Enum`);
        }

        if (field.formatter) {
          g.writeLn(`\t${field.name}_string: String`);
        }
      });
      g.writeLn(`}`);
    }

    g.writeLn();
  }

  function preventTwice(name, names, work) {
    if (!names.has(name)) {
      names.add(name);
      work();
    }
  }

  function genGFiltersForArrayFields(type, gNames) {
    type.fields.forEach(field => {
      let itemTypeName = field.type.name;

      for (let i = 0; i < field.arrayDepth; i += 1) {
        const filterName = `${itemTypeName}ArrayFilter`;
        preventTwice(filterName, gNames, () => {
          g.writeLn(`input ${filterName} {`);
          ['any', 'all'].forEach(op => {
            g.writeLn(`\t${op}: ${itemTypeName}Filter`);
          });
          g.writeLn('}');
          g.writeLn();
        });
        itemTypeName += 'Array';
      }
    });
  }

  function genGFiltersForEnumNameFields(type, gNames) {
    type.fields.forEach(field => {
      const enumDef = field.enumDef;

      if (enumDef) {
        preventTwice(`${enumDef.name}EnumFilter`, gNames, () => {
          genGScalarTypesFilter(`${enumDef.name}Enum`);
        });
      }
    });
  }

  function genGFilter(type, gNames) {
    if (type.fields.length === 0) {
      return;
    }

    genGFiltersForArrayFields(type, gNames);
    genGFiltersForEnumNameFields(type, gNames);
    genGDoc('', type.doc);
    g.writeLn(`input ${type.name}Filter {`);
    type.fields.forEach(field => {
      genGDoc('\t', field.doc);
      const typeDeclaration = field.type.name + "Array".repeat(field.arrayDepth);
      g.writeLn(`\t${field.name}: ${typeDeclaration}Filter`);
      const enumDef = field.enumDef;

      if (enumDef) {
        g.writeLn(`\t${field.name}_name: ${enumDef.name}EnumFilter`);
      }
    });
    g.writeLn(`    OR: ${type.name}Filter`);
    g.writeLn(`}`);
    g.writeLn();
  }

  function genGScalarTypesFilter(name) {
    g.writeLn(`input ${name}Filter {`);
    ['eq', 'ne', 'gt', 'lt', 'ge', 'le'].forEach(op => {
      g.writeLn(`\t${op}: ${name}`);
    });
    ['in', 'notIn'].forEach(op => {
      g.writeLn(`\t${op}: [${name}]`);
    });
    g.writeLn('}');
    g.writeLn();
  }

  function genGQueries(types) {
    g.writeBlockLn(`
        "Specify sort order direction"
        enum QueryOrderByDirection {
            "Documents will be sorted in ascended order (e.g. from A to Z)"
            ASC
            "Documents will be sorted in descendant order (e.g. from Z to A)"
            DESC
        }

        
        """
        Specify how to sort results.
        You can sort documents in result set using more than one field.
        """
        input QueryOrderBy {
            """
            Path to field which must be used as a sort criteria.
            If field resides deep in structure path items must be separated with dot (e.g. 'foo.bar.baz').
            """
            path: String
            "Sort order direction"
            direction: QueryOrderByDirection
        }

        type Query {
        `);
    types.forEach(type => {
      g.writeLn(`\t${type.collection || ''}(filter: ${type.name}Filter, orderBy: [QueryOrderBy], limit: Int, timeout: Float, accessKey: String, operationId: String): [${type.name}]`);
    });
    g.writeBlockLn(`
        }

        `);
  }

  function genGSubscriptions(types) {
    g.writeLn('type Subscription {');
    types.forEach(type => {
      g.writeLn(`\t${type.collection || ''}(filter: ${type.name}Filter, accessKey: String): ${type.name}`);
    });
    g.writeLn('}');
  }

  function getScalarResolverName(field) {
    if (field.type === _dbSchemaTypes.scalarTypes.uint64) {
      return 'bigUInt1';
    }

    if (field.type === _dbSchemaTypes.scalarTypes.uint1024) {
      return 'bigUInt2';
    }

    return 'scalar';
  }

  function genJSFiltersForArrayFields(type, jsNames) {
    type.fields.forEach(field => {
      let itemTypeName = field.type.name;

      for (let i = 0; i < field.arrayDepth; i += 1) {
        const filterName = `${itemTypeName}Array`;
        preventTwice(filterName, jsNames, () => {
          const itemResolverName = i === 0 && field.type.category === _dbSchemaTypes.DbTypeCategory.scalar ? getScalarResolverName(field) : itemTypeName;
          js.writeBlockLn(`
                const ${filterName} = array(() => ${itemResolverName});
                `);
        });
        itemTypeName += 'Array';
      }
    });
  }

  function genJSStructFilter(type) {
    js.writeBlockLn(`
        const ${type.name} = struct({
    `);
    type.fields.forEach(field => {
      let typeDeclaration = null;
      const join = field.join;

      if (join) {
        const suffix = field.arrayDepth > 0 ? 'Array' : '';
        typeDeclaration = `join${suffix}('${join.on}', '${join.refOn}', '${field.type.collection || ''}', () => ${field.type.name})`;
      } else if (field.arrayDepth > 0) {
        typeDeclaration = field.type.name + 'Array'.repeat(field.arrayDepth);
      } else if (field.type.category === _dbSchemaTypes.DbTypeCategory.scalar) {
        typeDeclaration = getScalarResolverName(field);
      } else if (field.type.fields.length > 0) {
        typeDeclaration = field.type.name;
      }

      if (typeDeclaration) {
        js.writeLn(`    ${field.name}: ${typeDeclaration},`);
        const enumDef = field.enumDef;

        if (enumDef) {
          js.writeLn(`    ${field.name}_name: enumName('${field.name}', ${(0, _dbSchemaTypes.stringifyEnumValues)(enumDef.values)}),`);
        }

        if (field.formatter) {
          js.writeLn(`    ${field.name}_string: stringCompanion('${field.name}'),`);
        }
      }
    });
    js.writeBlockLn(`
        }${type.collection ? ', true' : ''});

    `);
  }

  function genJSUnionResolver(type) {
    js.writeBlockLn(`
        const ${type.name}Resolver = {
            __resolveType(obj, context, info) {
        `);
    type.fields.forEach(variant => {
      js.writeLn(`        if ('${variant.name}' in obj) {`);
      js.writeLn(`            return '${unionVariantType(type, variant)}';`);
      js.writeLn(`        }`);
    });
    js.writeBlockLn(`
                return null;
            }
        };

        `);
  }

  function genJSFilter(type, jsNames) {
    if (type.fields.length === 0) {
      return;
    }

    if (type.category === _dbSchemaTypes.DbTypeCategory.union) {// genJSFiltersForUnionVariants(type, jsNames);
    }

    genJSFiltersForArrayFields(type, jsNames);
    genJSStructFilter(type);

    if (type.category === _dbSchemaTypes.DbTypeCategory.union) {
      genJSUnionResolver(type);
    }
  }
  /**
   * Generate custom resolvers for types with:
   * - id field
   * - join fields
   * - u64 and higher fields
   * @param type
   */


  function genJSCustomResolvers(type) {
    const joinFields = type.fields.filter(x => !!x.join);
    const bigUIntFields = type.fields.filter(x => (0, _dbSchemaTypes.isBigInt)(x.type));
    const stringFormattedFields = type.fields.filter(x => x.formatter);
    const enumFields = type.fields.filter(x => x.enumDef);
    const customResolverRequired = type.collection || joinFields.length > 0 || bigUIntFields.length > 0 || enumFields.length > 0;

    if (!customResolverRequired) {
      return;
    }

    js.writeLn(`        ${type.name}: {`);

    if (type.collection) {
      js.writeLn('            id(parent) {');
      js.writeLn('                return parent._key;');
      js.writeLn('            },');
    }

    joinFields.forEach(field => {
      const join = field.join;

      if (!join) {
        return;
      }

      const onField = type.fields.find(x => x.name === join.on);

      if (!onField) {
        throw 'Join on field does not exist.';
      }

      const on = join.on === 'id' ? '_key' : join.on || '_key';
      const refOn = join.refOn === 'id' ? '_key' : join.refOn || '_key';
      const collection = field.type.collection;

      if (!collection) {
        throw 'Joined type is not a collection.';
      }

      js.writeLn(`            ${field.name}(parent, args, context) {`);

      if (join.preCondition) {
        js.writeLn(`                if (!(${join.preCondition})) {`);
        js.writeLn(`                    return null;`);
        js.writeLn(`                }`);
      }

      js.writeLn(`                if (args.when && !${type.name}.test(null, parent, args.when)) {`);
      js.writeLn(`                    return null;`);
      js.writeLn(`                }`);

      if (field.arrayDepth === 0) {
        js.writeLn(`                return context.db.${collection}.waitForDoc(parent.${on}, '${refOn}', args, context);`);
      } else if (field.arrayDepth === 1) {
        js.writeLn(`                return context.db.${collection}.waitForDocs(parent.${on}, '${refOn}', args, context);`);
      } else {
        throw 'Joins on a nested arrays does not supported.';
      }

      js.writeLn(`            },`);
    });
    bigUIntFields.forEach(field => {
      const prefixLength = field.type === _dbSchemaTypes.scalarTypes.uint64 ? 1 : 2;
      js.writeLn(`            ${field.name}(parent, args) {`);
      js.writeLn(`                return resolveBigUInt(${prefixLength}, parent.${field.name}, args);`);
      js.writeLn(`            },`);
    });
    stringFormattedFields.forEach(field => {
      js.writeLn(`            ${field.name}_string(parent, args) {`);
      js.writeLn(`                return ${field.formatter || ''}(parent.${field.name});`);
      js.writeLn(`            },`);
    });
    enumFields.forEach(field => {
      const enumDef = field.enumDef;

      if (enumDef) {
        js.writeLn(`            ${field.name}_name: createEnumNameResolver('${field.name}', ${(0, _dbSchemaTypes.stringifyEnumValues)(enumDef.values)}),`);
      }
    });
    js.writeLn(`        },`);
  }

  function genJSScalarFields(type, parentPath, parentDocPath) {
    type.fields.forEach(field => {
      if (field.join || field.enumDef) {
        return;
      }

      const docName = field.name === 'id' ? '_key' : field.name;
      const path = `${parentPath}.${field.name}`;
      let docPath = `${parentDocPath}.${docName}`;

      if (field.arrayDepth > 0) {
        let suffix = '[*]';

        for (let depth = 10; depth > 0; depth -= 1) {
          const s = `[${'*'.repeat(depth)}]`;

          if (docPath.includes(s)) {
            suffix = `[${'*'.repeat(depth + 1)}]`;
            break;
          }
        }

        docPath = `${docPath}${suffix}`;
      }

      switch (field.type.category) {
        case "scalar":
          let typeName;

          if (field.type === _dbSchemaTypes.scalarTypes.boolean) {
            typeName = 'boolean';
          } else if (field.type === _dbSchemaTypes.scalarTypes.float) {
            typeName = 'number';
          } else if (field.type === _dbSchemaTypes.scalarTypes.int) {
            typeName = 'number';
          } else if (field.type === _dbSchemaTypes.scalarTypes.uint64) {
            typeName = 'uint64';
          } else if (field.type === _dbSchemaTypes.scalarTypes.uint1024) {
            typeName = 'uint1024';
          } else {
            typeName = 'string';
          }

          js.writeLn(`scalarFields.set('${path}', { type: '${typeName}', path: '${docPath}' });`);
          break;

        case "struct":
        case "union":
          genJSScalarFields(field.type, path, docPath);
          break;
      }
    });
  }

  function genJSTypeResolversForUnion(type) {
    if (type.category === _dbSchemaTypes.DbTypeCategory.union) {
      js.writeLn(`        ${type.name}: ${type.name}Resolver,`);
    }
  }

  function generate(types) {
    // G
    g.writeBlockLn(`
        """
        Due to GraphQL limitations big numbers are returned as a string.
        You can specify format used to string representation for big integers.
        """
        enum BigIntFormat {
            " Hexadecimal representation started with 0x (default) "
            HEX
            " Decimal representation "
            DEC
        }
        `);
    ['String', 'Boolean', 'Int', 'Float'].forEach(genGScalarTypesFilter);
    genGEnumTypes();
    types.forEach(type => genGTypeDeclaration(type));
    const gArrayFilters = new Set();
    types.forEach(type => genGFilter(type, gArrayFilters));
    const collections = types.filter(t => !!t.collection);
    genGQueries(collections);
    genGSubscriptions(collections); // JS

    js.writeBlockLn(`
        const {
            scalar,
            bigUInt1,
            bigUInt2,
            resolveBigUInt,
            struct,
            array,
            join,
            joinArray,
            enumName,
            stringCompanion,
            createEnumNameResolver,
            unixMillisecondsToString,
            unixSecondsToString,
        } = require('./db-types.js');
        `);
    const jsArrayFilters = new Set();
    types.forEach(type => genJSFilter(type, jsArrayFilters));
    js.writeBlockLn(`
        function createResolvers(db) {
            return {
        `);
    types.forEach(type => {
      genJSCustomResolvers(type);
      genJSTypeResolversForUnion(type);
    });
    js.writeLn('        Query: {');
    collections.forEach(type => {
      js.writeLn(`            ${type.collection || ''}: db.${type.collection || ''}.queryResolver(),`);
    });
    js.writeLn('        },');
    js.writeLn('        Subscription: {');
    collections.forEach(type => {
      js.writeLn(`            ${type.collection || ''}: db.${type.collection || ''}.subscriptionResolver(),`);
    });
    js.writeBlockLn(`
                }
            }
        }

        `);
    js.writeBlockLn(`
        const scalarFields = new Map();
        `);
    collections.forEach(type => {
      genJSScalarFields(type, type.collection || '', 'doc');
    });
    js.writeBlockLn(`
        module.exports = {
            scalarFields,
            createResolvers,
        `);
    types.forEach(type => js.writeLn(`    ${type.name},`));
    js.writeBlockLn(`
        };
        `);
  }

  generate(dbTypes);

  for (const e of enumTypes.values()) {
    console.log(`export const Q${e.name} = {`);
    console.log(Object.entries(e.values).map(([name, value]) => {
      return `    ${name}: ${value},`;
    }).join('\n'));
    console.log(`};\n`);
  }

  return {
    ql: g.generated(),
    js: js.generated()
  };
}

var _default = main;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9zY2hlbWEvcWwtanMtZ2VuZXJhdG9yLmpzIl0sIm5hbWVzIjpbIm1haW4iLCJzY2hlbWFEZWYiLCJ0eXBlcyIsImRiVHlwZXMiLCJlbnVtVHlwZXMiLCJnIiwiV3JpdGVyIiwianMiLCJnZW5HRG9jIiwicHJlZml4IiwiZG9jIiwidHJpbSIsImxpbmVzIiwic3BsaXQiLCJsZW5ndGgiLCJpbmNsdWRlcyIsIndyaXRlTG4iLCJmb3JFYWNoIiwibGluZSIsInVuaW9uVmFyaWFudFR5cGUiLCJ0eXBlIiwidmFyaWFudCIsIm5hbWUiLCJnZW5HVHlwZURlY2xhcmF0aW9uc0ZvclVuaW9uVmFyaWFudHMiLCJmaWVsZHMiLCJ3cml0ZUJsb2NrTG4iLCJnZW5HRW51bVR5cGVzIiwiZW51bURlZiIsInZhbHVlcyIsIk9iamVjdCIsImtleXMiLCJnZW5HVHlwZURlY2xhcmF0aW9uIiwiY2F0ZWdvcnkiLCJEYlR5cGVDYXRlZ29yeSIsInVuaW9uIiwiZmllbGQiLCJ0eXBlRGVjbGFyYXRpb24iLCJyZXBlYXQiLCJhcnJheURlcHRoIiwicGFyYW1zIiwiam9pbiIsImZvcm1hdHRlciIsInByZXZlbnRUd2ljZSIsIm5hbWVzIiwid29yayIsImhhcyIsImFkZCIsImdlbkdGaWx0ZXJzRm9yQXJyYXlGaWVsZHMiLCJnTmFtZXMiLCJpdGVtVHlwZU5hbWUiLCJpIiwiZmlsdGVyTmFtZSIsIm9wIiwiZ2VuR0ZpbHRlcnNGb3JFbnVtTmFtZUZpZWxkcyIsImdlbkdTY2FsYXJUeXBlc0ZpbHRlciIsImdlbkdGaWx0ZXIiLCJnZW5HUXVlcmllcyIsImNvbGxlY3Rpb24iLCJnZW5HU3Vic2NyaXB0aW9ucyIsImdldFNjYWxhclJlc29sdmVyTmFtZSIsInNjYWxhclR5cGVzIiwidWludDY0IiwidWludDEwMjQiLCJnZW5KU0ZpbHRlcnNGb3JBcnJheUZpZWxkcyIsImpzTmFtZXMiLCJpdGVtUmVzb2x2ZXJOYW1lIiwic2NhbGFyIiwiZ2VuSlNTdHJ1Y3RGaWx0ZXIiLCJzdWZmaXgiLCJvbiIsInJlZk9uIiwiZ2VuSlNVbmlvblJlc29sdmVyIiwiZ2VuSlNGaWx0ZXIiLCJnZW5KU0N1c3RvbVJlc29sdmVycyIsImpvaW5GaWVsZHMiLCJmaWx0ZXIiLCJ4IiwiYmlnVUludEZpZWxkcyIsInN0cmluZ0Zvcm1hdHRlZEZpZWxkcyIsImVudW1GaWVsZHMiLCJjdXN0b21SZXNvbHZlclJlcXVpcmVkIiwib25GaWVsZCIsImZpbmQiLCJwcmVDb25kaXRpb24iLCJwcmVmaXhMZW5ndGgiLCJnZW5KU1NjYWxhckZpZWxkcyIsInBhcmVudFBhdGgiLCJwYXJlbnREb2NQYXRoIiwiZG9jTmFtZSIsInBhdGgiLCJkb2NQYXRoIiwiZGVwdGgiLCJzIiwidHlwZU5hbWUiLCJib29sZWFuIiwiZmxvYXQiLCJpbnQiLCJnZW5KU1R5cGVSZXNvbHZlcnNGb3JVbmlvbiIsImdlbmVyYXRlIiwiZ0FycmF5RmlsdGVycyIsIlNldCIsImNvbGxlY3Rpb25zIiwidCIsImpzQXJyYXlGaWx0ZXJzIiwiZSIsImNvbnNvbGUiLCJsb2ciLCJlbnRyaWVzIiwibWFwIiwidmFsdWUiLCJxbCIsImdlbmVyYXRlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUdBOztBQVFBLFNBQVNBLElBQVQsQ0FBY0MsU0FBZCxFQUFrQztBQUM5QixRQUFNO0FBQUVDLElBQUFBLEtBQUssRUFBRUMsT0FBVDtBQUFrQkMsSUFBQUE7QUFBbEIsTUFBK0Isa0NBQWNILFNBQWQsQ0FBckMsQ0FEOEIsQ0FHbEM7O0FBRUksUUFBTUksQ0FBQyxHQUFHLElBQUlDLFdBQUosRUFBVjtBQUNBLFFBQU1DLEVBQUUsR0FBRyxJQUFJRCxXQUFKLEVBQVg7O0FBRUEsV0FBU0UsT0FBVCxDQUFpQkMsTUFBakIsRUFBaUNDLEdBQWpDLEVBQThDO0FBQzFDLFFBQUlBLEdBQUcsQ0FBQ0MsSUFBSixPQUFlLEVBQW5CLEVBQXVCO0FBQ25CO0FBQ0g7O0FBQ0QsVUFBTUMsS0FBSyxHQUFHRixHQUFHLENBQUNHLEtBQUosQ0FB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Q0gsS0FGRDtBQUlBbEQsSUFBQUEsRUFBRSxDQUFDa0IsWUFBSCxDQUFpQjs7OztTQUFqQjtBQUtBdkIsSUFBQUEsS0FBSyxDQUFDZSxPQUFOLENBQWNHLElBQUksSUFBSWIsRUFBRSxDQUFDUyxPQUFILENBQVksT0FBTUksSUFBSSxDQUFDRSxJQUFLLEdBQTVCLENBQXRCO0FBQ0FmLElBQUFBLEVBQUUsQ0FBQ2tCLFlBQUgsQ0FBaUI7O1NBQWpCO0FBR0g7O0FBRUR5RSxFQUFBQSxRQUFRLENBQUMvRixPQUFELENBQVI7O0FBRUEsT0FBSyxNQUFNcUcsQ0FBWCxJQUE0QnBHLFNBQVMsQ0FBQ3dCLE1BQVYsRUFBNUIsRUFBZ0Q7QUFDNUM2RSxJQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBYSxpQkFBZ0JGLENBQUMsQ0FBQ2xGLElBQUssTUFBcEM7QUFDQW1GLElBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZN0UsTUFBTSxDQUFDOEUsT0FBUCxDQUFlSCxDQUFDLENBQUM1RSxNQUFqQixFQUF5QmdGLEdBQXpCLENBQTZCLENBQUMsQ0FBQ3RGLElBQUQsRUFBT3VGLEtBQVAsQ0FBRCxLQUFtQjtBQUN4RCxhQUFRLE9BQU12RixJQUFLLEtBQUt1RixLQUFZLEdBQXBDO0FBQ0gsS0FGVyxFQUVUckUsSUFGUyxDQUVKLElBRkksQ0FBWjtBQUdBaUUsSUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQWEsTUFBYjtBQUNIOztBQUVELFNBQU87QUFDSEksSUFBQUEsRUFBRSxFQUFFekcsQ0FBQyxDQUFDMEcsU0FBRixFQUREO0FBRUh4RyxJQUFBQSxFQUFFLEVBQUVBLEVBQUUsQ0FBQ3dHLFNBQUg7QUFGRCxHQUFQO0FBSUg7O2VBRWMvRyxJIiwic291cmNlc0NvbnRlbnQiOlsiLy9AZmxvd1xuXG5pbXBvcnQge1dyaXRlcn0gZnJvbSAnLi9nZW4uanMnO1xuaW1wb3J0IHR5cGUge1R5cGVEZWZ9IGZyb20gJy4vc2NoZW1hLmpzJztcbmltcG9ydCB0eXBlIHtEYkZpZWxkLCBEYlR5cGUsIEludEVudW1EZWZ9IGZyb20gJy4vZGItc2NoZW1hLXR5cGVzJztcbmltcG9ydCB7XG4gICAgRGJUeXBlQ2F0ZWdvcnksXG4gICAgaXNCaWdJbnQsIHBhcnNlRGJTY2hlbWEsXG4gICAgc2NhbGFyVHlwZXMsXG4gICAgc3RyaW5naWZ5RW51bVZhbHVlcyxcbiAgICB0b0VudW1TdHlsZSxcbn0gZnJvbSAnLi9kYi1zY2hlbWEtdHlwZXMnO1xuXG5mdW5jdGlvbiBtYWluKHNjaGVtYURlZjogVHlwZURlZikge1xuICAgIGNvbnN0IHsgdHlwZXM6IGRiVHlwZXMsIGVudW1UeXBlc30gPSBwYXJzZURiU2NoZW1hKHNjaGVtYURlZik7XG5cbi8vIEdlbmVyYXRvcnNcblxuICAgIGNvbnN0IGcgPSBuZXcgV3JpdGVyKCk7XG4gICAgY29uc3QganMgPSBuZXcgV3JpdGVyKCk7XG5cbiAgICBmdW5jdGlvbiBnZW5HRG9jKHByZWZpeDogc3RyaW5nLCBkb2M6IHN0cmluZykge1xuICAgICAgICBpZiAoZG9jLnRyaW0oKSA9PT0gJycpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsaW5lcyA9IGRvYy5zcGxpdCgvXFxuXFxyP3xcXHJcXG4/Lyk7XG4gICAgICAgIGlmIChsaW5lcy5sZW5ndGggPT09IDEgJiYgIWxpbmVzWzBdLmluY2x1ZGVzKCdcIicpKSB7XG4gICAgICAgICAgICBnLndyaXRlTG4ocHJlZml4LCAnXCInLCBsaW5lc1swXSwgJ1wiJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnLndyaXRlTG4ocHJlZml4LCAnXCJcIlwiJyk7XG4gICAgICAgICAgICBsaW5lcy5mb3JFYWNoKChsaW5lKSA9PiB7XG4gICAgICAgICAgICAgICAgZy53cml0ZUxuKHByZWZpeCwgbGluZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGcud3JpdGVMbihwcmVmaXgsICdcIlwiXCInKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVuaW9uVmFyaWFudFR5cGUodHlwZTogRGJUeXBlLCB2YXJpYW50OiBEYkZpZWxkKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGAke3R5cGUubmFtZX0ke3ZhcmlhbnQubmFtZX1WYXJpYW50YDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZW5HVHlwZURlY2xhcmF0aW9uc0ZvclVuaW9uVmFyaWFudHModHlwZTogRGJUeXBlKSB7XG4gICAgICAgIHR5cGUuZmllbGRzLmZvckVhY2goKHZhcmlhbnQpID0+IHtcbiAgICAgICAgICAgIGcud3JpdGVCbG9ja0xuKGBcbiAgICAgICAgdHlwZSAke3VuaW9uVmFyaWFudFR5cGUodHlwZSwgdmFyaWFudCl9IHtcbiAgICAgICAgICAgICR7dmFyaWFudC5uYW1lfTogJHt2YXJpYW50LnR5cGUubmFtZX1cbiAgICAgICAgfVxuXG4gICAgICAgIGApO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZW5HRW51bVR5cGVzKCkge1xuICAgICAgICBmb3IgKGNvbnN0IGVudW1EZWY6IEludEVudW1EZWYgb2YgZW51bVR5cGVzLnZhbHVlcygpKSB7XG4gICAgICAgICAgICBnLndyaXRlTG4oYGVudW0gJHtlbnVtRGVmLm5hbWV9RW51bSB7YCk7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhlbnVtRGVmLnZhbHVlcykuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgICAgICAgICAgIGcud3JpdGVMbihgICAgICR7dG9FbnVtU3R5bGUobmFtZSl9YCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGcud3JpdGVMbihgfWApO1xuICAgICAgICAgICAgZy53cml0ZUxuKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZW5HVHlwZURlY2xhcmF0aW9uKHR5cGU6IERiVHlwZSkge1xuICAgICAgICBpZiAodHlwZS5jYXRlZ29yeSA9PT0gRGJUeXBlQ2F0ZWdvcnkudW5pb24pIHtcbiAgICAgICAgICAgIGdlbkdUeXBlRGVjbGFyYXRpb25zRm9yVW5pb25WYXJpYW50cyh0eXBlKTtcbiAgICAgICAgICAgIGcud3JpdGVMbihgdW5pb24gJHt0eXBlLm5hbWV9ID0gYCk7XG4gICAgICAgICAgICB0eXBlLmZpZWxkcy5mb3JFYWNoKHZhcmlhbnQgPT4ge1xuICAgICAgICAgICAgICAgIGcud3JpdGVMbihgXFx0fCAke3VuaW9uVmFyaWFudFR5cGUodHlwZSwgdmFyaWFudCl9YCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGcud3JpdGVMbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ2VuR0RvYygnJywgdHlwZS5kb2MpO1xuICAgICAgICAgICAgZy53cml0ZUxuKGB0eXBlICR7dHlwZS5uYW1lfSB7YCk7XG4gICAgICAgICAgICB0eXBlLmZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgICAgICAgICAgICBnZW5HRG9jKCdcXHQnLCBmaWVsZC5kb2MpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHR5cGVEZWNsYXJhdGlvbiA9XG4gICAgICAgICAgICAgICAgICAgICdbJy5yZXBlYXQoZmllbGQuYXJyYXlEZXB0aCkgK1xuICAgICAgICAgICAgICAgICAgICBmaWVsZC50eXBlLm5hbWUgK1xuICAgICAgICAgICAgICAgICAgICAnXScucmVwZWF0KGZpZWxkLmFycmF5RGVwdGgpO1xuICAgICAgICAgICAgICAgIGxldCBwYXJhbXMgPSAnJztcbiAgICAgICAgICAgICAgICBpZiAoaXNCaWdJbnQoZmllbGQudHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zID0gJyhmb3JtYXQ6IEJpZ0ludEZvcm1hdCknO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGQuam9pbikge1xuICAgICAgICAgICAgICAgICAgICBwYXJhbXMgPSBgKHRpbWVvdXQ6IEludCwgd2hlbjogJHt0eXBlLm5hbWV9RmlsdGVyKWA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZy53cml0ZUxuKGBcXHQke2ZpZWxkLm5hbWV9JHtwYXJhbXN9OiAke3R5cGVEZWNsYXJhdGlvbn1gKTtcbiAgICAgICAgICAgICAgICBjb25zdCBlbnVtRGVmID0gZmllbGQuZW51bURlZjtcbiAgICAgICAgICAgICAgICBpZiAoZW51bURlZikge1xuICAgICAgICAgICAgICAgICAgICBnLndyaXRlTG4oYFxcdCR7ZmllbGQubmFtZX1fbmFtZTogJHtlbnVtRGVmLm5hbWV9RW51bWApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZmllbGQuZm9ybWF0dGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGcud3JpdGVMbihgXFx0JHtmaWVsZC5uYW1lfV9zdHJpbmc6IFN0cmluZ2ApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZy53cml0ZUxuKGB9YCk7XG4gICAgICAgIH1cbiAgICAgICAgZy53cml0ZUxuKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJldmVudFR3aWNlKG5hbWU6IHN0cmluZywgbmFtZXM6IFNldDxzdHJpbmc+LCB3b3JrOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgIGlmICghbmFtZXMuaGFzKG5hbWUpKSB7XG4gICAgICAgICAgICBuYW1lcy5hZGQobmFtZSk7XG4gICAgICAgICAgICB3b3JrKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZW5HRmlsdGVyc0ZvckFycmF5RmllbGRzKHR5cGU6IERiVHlwZSwgZ05hbWVzOiBTZXQ8c3RyaW5nPikge1xuICAgICAgICB0eXBlLmZpZWxkcy5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgICAgICAgICAgbGV0IGl0ZW1UeXBlTmFtZSA9IGZpZWxkLnR5cGUubmFtZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmllbGQuYXJyYXlEZXB0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZmlsdGVyTmFtZSA9IGAke2l0ZW1UeXBlTmFtZX1BcnJheUZpbHRlcmA7XG4gICAgICAgICAgICAgICAgcHJldmVudFR3aWNlKGZpbHRlck5hbWUsIGdOYW1lcywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBnLndyaXRlTG4oYGlucHV0ICR7ZmlsdGVyTmFtZX0ge2ApO1xuICAgICAgICAgICAgICAgICAgICBbJ2FueScsICdhbGwnXS5mb3JFYWNoKChvcCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZy53cml0ZUxuKGBcXHQke29wfTogJHtpdGVtVHlwZU5hbWV9RmlsdGVyYCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBnLndyaXRlTG4oJ30nKTtcbiAgICAgICAgICAgICAgICAgICAgZy53cml0ZUxuKCk7XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpdGVtVHlwZU5hbWUgKz0gJ0FycmF5JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2VuR0ZpbHRlcnNGb3JFbnVtTmFtZUZpZWxkcyh0eXBlOiBEYlR5cGUsIGdOYW1lczogU2V0PHN0cmluZz4pIHtcbiAgICAgICAgdHlwZS5maWVsZHMuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVudW1EZWYgPSBmaWVsZC5lbnVtRGVmO1xuICAgICAgICAgICAgaWYgKGVudW1EZWYpIHtcbiAgICAgICAgICAgICAgICBwcmV2ZW50VHdpY2UoYCR7ZW51bURlZi5uYW1lfUVudW1GaWx0ZXJgLCBnTmFtZXMsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZ2VuR1NjYWxhclR5cGVzRmlsdGVyKGAke2VudW1EZWYubmFtZX1FbnVtYCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdlbkdGaWx0ZXIodHlwZTogRGJUeXBlLCBnTmFtZXM6IFNldDxzdHJpbmc+KSB7XG4gICAgICAgIGlmICh0eXBlLmZpZWxkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBnZW5HRmlsdGVyc0ZvckFycmF5RmllbGRzKHR5cGUsIGdOYW1lcyk7XG4gICAgICAgIGdlbkdGaWx0ZXJzRm9yRW51bU5hbWVGaWVsZHModHlwZSwgZ05hbWVzKTtcbiAgICAgICAgZ2VuR0RvYygnJywgdHlwZS5kb2MpO1xuICAgICAgICBnLndyaXRlTG4oYGlucHV0ICR7dHlwZS5uYW1lfUZpbHRlciB7YCk7XG4gICAgICAgIHR5cGUuZmllbGRzLmZvckVhY2goKGZpZWxkKSA9PiB7XG4gICAgICAgICAgICBnZW5HRG9jKCdcXHQnLCBmaWVsZC5kb2MpO1xuICAgICAgICAgICAgY29uc3QgdHlwZURlY2xhcmF0aW9uID0gZmllbGQudHlwZS5uYW1lICsgXCJBcnJheVwiLnJlcGVhdChmaWVsZC5hcnJheURlcHRoKTtcbiAgICAgICAgICAgIGcud3JpdGVMbihgXFx0JHtmaWVsZC5uYW1lfTogJHt0eXBlRGVjbGFyYXRpb259RmlsdGVyYCk7XG4gICAgICAgICAgICBjb25zdCBlbnVtRGVmID0gZmllbGQuZW51bURlZjtcbiAgICAgICAgICAgIGlmIChlbnVtRGVmKSB7XG4gICAgICAgICAgICAgICAgZy53cml0ZUxuKGBcXHQke2ZpZWxkLm5hbWV9X25hbWU6ICR7ZW51bURlZi5uYW1lfUVudW1GaWx0ZXJgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGcud3JpdGVMbihgICAgIE9SOiAke3R5cGUubmFtZX1GaWx0ZXJgKTtcbiAgICAgICAgZy53cml0ZUxuKGB9YCk7XG4gICAgICAgIGcud3JpdGVMbigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdlbkdTY2FsYXJUeXBlc0ZpbHRlcihuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgZy53cml0ZUxuKGBpbnB1dCAke25hbWV9RmlsdGVyIHtgKTtcbiAgICAgICAgWydlcScsICduZScsICdndCcsICdsdCcsICdnZScsICdsZSddLmZvckVhY2goKG9wKSA9PiB7XG4gICAgICAgICAgICBnLndyaXRlTG4oYFxcdCR7b3B9OiAke25hbWV9YCk7XG4gICAgICAgIH0pO1xuICAgICAgICBbJ2luJywgJ25vdEluJ10uZm9yRWFjaCgob3ApID0+IHtcbiAgICAgICAgICAgIGcud3JpdGVMbihgXFx0JHtvcH06IFske25hbWV9XWApO1xuICAgICAgICB9KTtcbiAgICAgICAgZy53cml0ZUxuKCd9Jyk7XG4gICAgICAgIGcud3JpdGVMbigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdlbkdRdWVyaWVzKHR5cGVzOiBEYlR5cGVbXSkge1xuICAgICAgICBnLndyaXRlQmxvY2tMbihgXG4gICAgICAgIFwiU3BlY2lmeSBzb3J0IG9yZGVyIGRpcmVjdGlvblwiXG4gICAgICAgIGVudW0gUXVlcnlPcmRlckJ5RGlyZWN0aW9uIHtcbiAgICAgICAgICAgIFwiRG9jdW1lbnRzIHdpbGwgYmUgc29ydGVkIGluIGFzY2VuZGVkIG9yZGVyIChlLmcuIGZyb20gQSB0byBaKVwiXG4gICAgICAgICAgICBBU0NcbiAgICAgICAgICAgIFwiRG9jdW1lbnRzIHdpbGwgYmUgc29ydGVkIGluIGRlc2NlbmRhbnQgb3JkZXIgKGUuZy4gZnJvbSBaIHRvIEEpXCJcbiAgICAgICAgICAgIERFU0NcbiAgICAgICAgfVxuXG4gICAgICAgIFxuICAgICAgICBcIlwiXCJcbiAgICAgICAgU3BlY2lmeSBob3cgdG8gc29ydCByZXN1bHRzLlxuICAgICAgICBZb3UgY2FuIHNvcnQgZG9jdW1lbnRzIGluIHJlc3VsdCBzZXQgdXNpbmcgbW9yZSB0aGFuIG9uZSBmaWVsZC5cbiAgICAgICAgXCJcIlwiXG4gICAgICAgIGlucHV0IFF1ZXJ5T3JkZXJCeSB7XG4gICAgICAgICAgICBcIlwiXCJcbiAgICAgICAgICAgIFBhdGggdG8gZmllbGQgd2hpY2ggbXVzdCBiZSB1c2VkIGFzIGEgc29ydCBjcml0ZXJpYS5cbiAgICAgICAgICAgIElmIGZpZWxkIHJlc2lkZXMgZGVlcCBpbiBzdHJ1Y3R1cmUgcGF0aCBpdGVtcyBtdXN0IGJlIHNlcGFyYXRlZCB3aXRoIGRvdCAoZS5nLiAnZm9vLmJhci5iYXonKS5cbiAgICAgICAgICAgIFwiXCJcIlxuICAgICAgICAgICAgcGF0aDogU3RyaW5nXG4gICAgICAgICAgICBcIlNvcnQgb3JkZXIgZGlyZWN0aW9uXCJcbiAgICAgICAgICAgIGRpcmVjdGlvbjogUXVlcnlPcmRlckJ5RGlyZWN0aW9uXG4gICAgICAgIH1cblxuICAgICAgICB0eXBlIFF1ZXJ5IHtcbiAgICAgICAgYCk7XG5cbiAgICAgICAgdHlwZXMuZm9yRWFjaCgodHlwZTogRGJUeXBlKSA9PiB7XG4gICAgICAgICAgICBnLndyaXRlTG4oYFxcdCR7dHlwZS5jb2xsZWN0aW9uIHx8ICcnfShmaWx0ZXI6ICR7dHlwZS5uYW1lfUZpbHRlciwgb3JkZXJCeTogW1F1ZXJ5T3JkZXJCeV0sIGxpbWl0OiBJbnQsIHRpbWVvdXQ6IEZsb2F0LCBhY2Nlc3NLZXk6IFN0cmluZywgb3BlcmF0aW9uSWQ6IFN0cmluZyk6IFske3R5cGUubmFtZX1dYCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGcud3JpdGVCbG9ja0xuKGBcbiAgICAgICAgfVxuXG4gICAgICAgIGApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdlbkdTdWJzY3JpcHRpb25zKHR5cGVzOiBEYlR5cGVbXSkge1xuICAgICAgICBnLndyaXRlTG4oJ3R5cGUgU3Vic2NyaXB0aW9uIHsnKTtcbiAgICAgICAgdHlwZXMuZm9yRWFjaCgodHlwZSkgPT4ge1xuICAgICAgICAgICAgZy53cml0ZUxuKGBcXHQke3R5cGUuY29sbGVjdGlvbiB8fCAnJ30oZmlsdGVyOiAke3R5cGUubmFtZX1GaWx0ZXIsIGFjY2Vzc0tleTogU3RyaW5nKTogJHt0eXBlLm5hbWV9YCk7XG4gICAgICAgIH0pO1xuICAgICAgICBnLndyaXRlTG4oJ30nKTtcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIGdldFNjYWxhclJlc29sdmVyTmFtZShmaWVsZDogRGJGaWVsZCk6IHN0cmluZyB7XG4gICAgICAgIGlmIChmaWVsZC50eXBlID09PSBzY2FsYXJUeXBlcy51aW50NjQpIHtcbiAgICAgICAgICAgIHJldHVybiAnYmlnVUludDEnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaWVsZC50eXBlID09PSBzY2FsYXJUeXBlcy51aW50MTAyNCkge1xuICAgICAgICAgICAgcmV0dXJuICdiaWdVSW50Mic7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICdzY2FsYXInO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdlbkpTRmlsdGVyc0ZvckFycmF5RmllbGRzKHR5cGU6IERiVHlwZSwganNOYW1lczogU2V0PHN0cmluZz4pIHtcbiAgICAgICAgdHlwZS5maWVsZHMuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgICAgICAgIGxldCBpdGVtVHlwZU5hbWUgPSBmaWVsZC50eXBlLm5hbWU7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpZWxkLmFycmF5RGVwdGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbHRlck5hbWUgPSBgJHtpdGVtVHlwZU5hbWV9QXJyYXlgO1xuICAgICAgICAgICAgICAgIHByZXZlbnRUd2ljZShmaWx0ZXJOYW1lLCBqc05hbWVzLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1SZXNvbHZlck5hbWUgPSAoaSA9PT0gMCAmJiBmaWVsZC50eXBlLmNhdGVnb3J5ID09PSBEYlR5cGVDYXRlZ29yeS5zY2FsYXIpXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGdldFNjYWxhclJlc29sdmVyTmFtZShmaWVsZClcbiAgICAgICAgICAgICAgICAgICAgICAgIDogaXRlbVR5cGVOYW1lO1xuICAgICAgICAgICAgICAgICAgICBqcy53cml0ZUJsb2NrTG4oYFxuICAgICAgICAgICAgICAgIGNvbnN0ICR7ZmlsdGVyTmFtZX0gPSBhcnJheSgoKSA9PiAke2l0ZW1SZXNvbHZlck5hbWV9KTtcbiAgICAgICAgICAgICAgICBgKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpdGVtVHlwZU5hbWUgKz0gJ0FycmF5JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2VuSlNTdHJ1Y3RGaWx0ZXIodHlwZTogRGJUeXBlKSB7XG4gICAgICAgIGpzLndyaXRlQmxvY2tMbihgXG4gICAgICAgIGNvbnN0ICR7dHlwZS5uYW1lfSA9IHN0cnVjdCh7XG4gICAgYCk7XG4gICAgICAgIHR5cGUuZmllbGRzLmZvckVhY2goKGZpZWxkOiBEYkZpZWxkKSA9PiB7XG4gICAgICAgICAgICBsZXQgdHlwZURlY2xhcmF0aW9uOiA/c3RyaW5nID0gbnVsbDtcbiAgICAgICAgICAgIGNvbnN0IGpvaW4gPSBmaWVsZC5qb2luO1xuICAgICAgICAgICAgaWYgKGpvaW4pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdWZmaXggPSBmaWVsZC5hcnJheURlcHRoID4gMCA/ICdBcnJheScgOiAnJztcbiAgICAgICAgICAgICAgICB0eXBlRGVjbGFyYXRpb24gPSBgam9pbiR7c3VmZml4fSgnJHtqb2luLm9ufScsICcke2pvaW4ucmVmT259JywgJyR7ZmllbGQudHlwZS5jb2xsZWN0aW9uIHx8ICcnfScsICgpID0+ICR7ZmllbGQudHlwZS5uYW1lfSlgO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmaWVsZC5hcnJheURlcHRoID4gMCkge1xuICAgICAgICAgICAgICAgIHR5cGVEZWNsYXJhdGlvbiA9XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkLnR5cGUubmFtZSArXG4gICAgICAgICAgICAgICAgICAgICdBcnJheScucmVwZWF0KGZpZWxkLmFycmF5RGVwdGgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmaWVsZC50eXBlLmNhdGVnb3J5ID09PSBEYlR5cGVDYXRlZ29yeS5zY2FsYXIpIHtcbiAgICAgICAgICAgICAgICB0eXBlRGVjbGFyYXRpb24gPSBnZXRTY2FsYXJSZXNvbHZlck5hbWUoZmllbGQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmaWVsZC50eXBlLmZpZWxkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdHlwZURlY2xhcmF0aW9uID0gZmllbGQudHlwZS5uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVEZWNsYXJhdGlvbikge1xuICAgICAgICAgICAgICAgIGpzLndyaXRlTG4oYCAgICAke2ZpZWxkLm5hbWV9OiAke3R5cGVEZWNsYXJhdGlvbn0sYCk7XG4gICAgICAgICAgICAgICAgY29uc3QgZW51bURlZiA9IGZpZWxkLmVudW1EZWY7XG4gICAgICAgICAgICAgICAgaWYgKGVudW1EZWYpIHtcbiAgICAgICAgICAgICAgICAgICAganMud3JpdGVMbihgICAgICR7ZmllbGQubmFtZX1fbmFtZTogZW51bU5hbWUoJyR7ZmllbGQubmFtZX0nLCAke3N0cmluZ2lmeUVudW1WYWx1ZXMoZW51bURlZi52YWx1ZXMpfSksYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChmaWVsZC5mb3JtYXR0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAganMud3JpdGVMbihgICAgICR7ZmllbGQubmFtZX1fc3RyaW5nOiBzdHJpbmdDb21wYW5pb24oJyR7ZmllbGQubmFtZX0nKSxgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBqcy53cml0ZUJsb2NrTG4oYFxuICAgICAgICB9JHt0eXBlLmNvbGxlY3Rpb24gPyAnLCB0cnVlJyA6ICcnfSk7XG5cbiAgICBgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZW5KU1VuaW9uUmVzb2x2ZXIodHlwZTogRGJUeXBlKSB7XG4gICAgICAgIGpzLndyaXRlQmxvY2tMbihgXG4gICAgICAgIGNvbnN0ICR7dHlwZS5uYW1lfVJlc29sdmVyID0ge1xuICAgICAgICAgICAgX19yZXNvbHZlVHlwZShvYmosIGNvbnRleHQsIGluZm8pIHtcbiAgICAgICAgYCk7XG4gICAgICAgIHR5cGUuZmllbGRzLmZvckVhY2goKHZhcmlhbnQpID0+IHtcbiAgICAgICAgICAgIGpzLndyaXRlTG4oYCAgICAgICAgaWYgKCcke3ZhcmlhbnQubmFtZX0nIGluIG9iaikge2ApO1xuICAgICAgICAgICAganMud3JpdGVMbihgICAgICAgICAgICAgcmV0dXJuICcke3VuaW9uVmFyaWFudFR5cGUodHlwZSwgdmFyaWFudCl9JztgKTtcbiAgICAgICAgICAgIGpzLndyaXRlTG4oYCAgICAgICAgfWApO1xuICAgICAgICB9KTtcbiAgICAgICAganMud3JpdGVCbG9ja0xuKGBcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZW5KU0ZpbHRlcih0eXBlOiBEYlR5cGUsIGpzTmFtZXM6IFNldDxzdHJpbmc+KSB7XG4gICAgICAgIGlmICh0eXBlLmZpZWxkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZS5jYXRlZ29yeSA9PT0gRGJUeXBlQ2F0ZWdvcnkudW5pb24pIHtcbiAgICAgICAgICAgIC8vIGdlbkpTRmlsdGVyc0ZvclVuaW9uVmFyaWFudHModHlwZSwganNOYW1lcyk7XG4gICAgICAgIH1cbiAgICAgICAgZ2VuSlNGaWx0ZXJzRm9yQXJyYXlGaWVsZHModHlwZSwganNOYW1lcyk7XG4gICAgICAgIGdlbkpTU3RydWN0RmlsdGVyKHR5cGUpO1xuICAgICAgICBpZiAodHlwZS5jYXRlZ29yeSA9PT0gRGJUeXBlQ2F0ZWdvcnkudW5pb24pIHtcbiAgICAgICAgICAgIGdlbkpTVW5pb25SZXNvbHZlcih0eXBlKTtcbiAgICAgICAgfVxuXG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZSBjdXN0b20gcmVzb2x2ZXJzIGZvciB0eXBlcyB3aXRoOlxuICAgICAqIC0gaWQgZmllbGRcbiAgICAgKiAtIGpvaW4gZmllbGRzXG4gICAgICogLSB1NjQgYW5kIGhpZ2hlciBmaWVsZHNcbiAgICAgKiBAcGFyYW0gdHlwZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdlbkpTQ3VzdG9tUmVzb2x2ZXJzKHR5cGU6IERiVHlwZSkge1xuICAgICAgICBjb25zdCBqb2luRmllbGRzID0gdHlwZS5maWVsZHMuZmlsdGVyKHggPT4gISF4LmpvaW4pO1xuICAgICAgICBjb25zdCBiaWdVSW50RmllbGRzID0gdHlwZS5maWVsZHMuZmlsdGVyKCh4OiBEYkZpZWxkKSA9PiBpc0JpZ0ludCh4LnR5cGUpKTtcbiAgICAgICAgY29uc3Qgc3RyaW5nRm9ybWF0dGVkRmllbGRzID0gdHlwZS5maWVsZHMuZmlsdGVyKCh4OiBEYkZpZWxkKSA9PiB4LmZvcm1hdHRlcik7XG4gICAgICAgIGNvbnN0IGVudW1GaWVsZHMgPSB0eXBlLmZpZWxkcy5maWx0ZXIoeCA9PiB4LmVudW1EZWYpO1xuICAgICAgICBjb25zdCBjdXN0b21SZXNvbHZlclJlcXVpcmVkID0gdHlwZS5jb2xsZWN0aW9uXG4gICAgICAgICAgICB8fCBqb2luRmllbGRzLmxlbmd0aCA+IDBcbiAgICAgICAgICAgIHx8IGJpZ1VJbnRGaWVsZHMubGVuZ3RoID4gMFxuICAgICAgICAgICAgfHwgZW51bUZpZWxkcy5sZW5ndGggPiAwO1xuICAgICAgICBpZiAoIWN1c3RvbVJlc29sdmVyUmVxdWlyZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBqcy53cml0ZUxuKGAgICAgICAgICR7dHlwZS5uYW1lfToge2ApO1xuICAgICAgICBpZiAodHlwZS5jb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICBqcy53cml0ZUxuKCcgICAgICAgICAgICBpZChwYXJlbnQpIHsnKTtcbiAgICAgICAgICAgIGpzLndyaXRlTG4oJyAgICAgICAgICAgICAgICByZXR1cm4gcGFyZW50Ll9rZXk7Jyk7XG4gICAgICAgICAgICBqcy53cml0ZUxuKCcgICAgICAgICAgICB9LCcpO1xuICAgICAgICB9XG4gICAgICAgIGpvaW5GaWVsZHMuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGpvaW4gPSBmaWVsZC5qb2luO1xuICAgICAgICAgICAgaWYgKCFqb2luKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qgb25GaWVsZCA9IHR5cGUuZmllbGRzLmZpbmQoeCA9PiB4Lm5hbWUgPT09IGpvaW4ub24pO1xuICAgICAgICAgICAgaWYgKCFvbkZpZWxkKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgJ0pvaW4gb24gZmllbGQgZG9lcyBub3QgZXhpc3QuJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG9uID0gam9pbi5vbiA9PT0gJ2lkJyA/ICdfa2V5JyA6IChqb2luLm9uIHx8ICdfa2V5Jyk7XG4gICAgICAgICAgICBjb25zdCByZWZPbiA9IGpvaW4ucmVmT24gPT09ICdpZCcgPyAnX2tleScgOiAoam9pbi5yZWZPbiB8fCAnX2tleScpO1xuICAgICAgICAgICAgY29uc3QgY29sbGVjdGlvbiA9IGZpZWxkLnR5cGUuY29sbGVjdGlvbjtcbiAgICAgICAgICAgIGlmICghY29sbGVjdGlvbikge1xuICAgICAgICAgICAgICAgIHRocm93ICdKb2luZWQgdHlwZSBpcyBub3QgYSBjb2xsZWN0aW9uLic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBqcy53cml0ZUxuKGAgICAgICAgICAgICAke2ZpZWxkLm5hbWV9KHBhcmVudCwgYXJncywgY29udGV4dCkge2ApO1xuICAgICAgICAgICAgaWYgKGpvaW4ucHJlQ29uZGl0aW9uKSB7XG4gICAgICAgICAgICAgICAganMud3JpdGVMbihgICAgICAgICAgICAgICAgIGlmICghKCR7am9pbi5wcmVDb25kaXRpb259KSkge2ApO1xuICAgICAgICAgICAgICAgIGpzLndyaXRlTG4oYCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7YCk7XG4gICAgICAgICAgICAgICAganMud3JpdGVMbihgICAgICAgICAgICAgICAgIH1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGpzLndyaXRlTG4oYCAgICAgICAgICAgICAgICBpZiAoYXJncy53aGVuICYmICEke3R5cGUubmFtZX0udGVzdChudWxsLCBwYXJlbnQsIGFyZ3Mud2hlbikpIHtgKTtcbiAgICAgICAgICAgIGpzLndyaXRlTG4oYCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7YCk7XG4gICAgICAgICAgICBqcy53cml0ZUxuKGAgICAgICAgICAgICAgICAgfWApO1xuXG4gICAgICAgICAgICBpZiAoZmllbGQuYXJyYXlEZXB0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGpzLndyaXRlTG4oYCAgICAgICAgICAgICAgICByZXR1cm4gY29udGV4dC5kYi4ke2NvbGxlY3Rpb259LndhaXRGb3JEb2MocGFyZW50LiR7b259LCAnJHtyZWZPbn0nLCBhcmdzLCBjb250ZXh0KTtgKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGQuYXJyYXlEZXB0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGpzLndyaXRlTG4oYCAgICAgICAgICAgICAgICByZXR1cm4gY29udGV4dC5kYi4ke2NvbGxlY3Rpb259LndhaXRGb3JEb2NzKHBhcmVudC4ke29ufSwgJyR7cmVmT259JywgYXJncywgY29udGV4dCk7YCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93ICdKb2lucyBvbiBhIG5lc3RlZCBhcnJheXMgZG9lcyBub3Qgc3VwcG9ydGVkLic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBqcy53cml0ZUxuKGAgICAgICAgICAgICB9LGApO1xuICAgICAgICB9KTtcbiAgICAgICAgYmlnVUludEZpZWxkcy5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcHJlZml4TGVuZ3RoID0gZmllbGQudHlwZSA9PT0gc2NhbGFyVHlwZXMudWludDY0ID8gMSA6IDI7XG4gICAgICAgICAgICBqcy53cml0ZUxuKGAgICAgICAgICAgICAke2ZpZWxkLm5hbWV9KHBhcmVudCwgYXJncykge2ApO1xuICAgICAgICAgICAganMud3JpdGVMbihgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlQmlnVUludCgke3ByZWZpeExlbmd0aH0sIHBhcmVudC4ke2ZpZWxkLm5hbWV9LCBhcmdzKTtgKTtcbiAgICAgICAgICAgIGpzLndyaXRlTG4oYCAgICAgICAgICAgIH0sYCk7XG4gICAgICAgIH0pO1xuICAgICAgICBzdHJpbmdGb3JtYXR0ZWRGaWVsZHMuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgICAgICAgIGpzLndyaXRlTG4oYCAgICAgICAgICAgICR7ZmllbGQubmFtZX1fc3RyaW5nKHBhcmVudCwgYXJncykge2ApO1xuICAgICAgICAgICAganMud3JpdGVMbihgICAgICAgICAgICAgICAgIHJldHVybiAke2ZpZWxkLmZvcm1hdHRlciB8fCAnJ30ocGFyZW50LiR7ZmllbGQubmFtZX0pO2ApO1xuICAgICAgICAgICAganMud3JpdGVMbihgICAgICAgICAgICAgfSxgKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGVudW1GaWVsZHMuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVudW1EZWYgPSBmaWVsZC5lbnVtRGVmO1xuICAgICAgICAgICAgaWYgKGVudW1EZWYpIHtcbiAgICAgICAgICAgICAgICBqcy53cml0ZUxuKGAgICAgICAgICAgICAke2ZpZWxkLm5hbWV9X25hbWU6IGNyZWF0ZUVudW1OYW1lUmVzb2x2ZXIoJyR7ZmllbGQubmFtZX0nLCAke3N0cmluZ2lmeUVudW1WYWx1ZXMoZW51bURlZi52YWx1ZXMpfSksYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBqcy53cml0ZUxuKGAgICAgICAgIH0sYCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2VuSlNTY2FsYXJGaWVsZHModHlwZTogRGJUeXBlLCBwYXJlbnRQYXRoLCBwYXJlbnREb2NQYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgdHlwZS5maWVsZHMuZm9yRWFjaCgoZmllbGQ6IERiRmllbGQpID0+IHtcbiAgICAgICAgICAgIGlmIChmaWVsZC5qb2luIHx8IGZpZWxkLmVudW1EZWYpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBkb2NOYW1lID0gZmllbGQubmFtZSA9PT0gJ2lkJyA/ICdfa2V5JyA6IGZpZWxkLm5hbWU7XG4gICAgICAgICAgICBjb25zdCBwYXRoID0gYCR7cGFyZW50UGF0aH0uJHtmaWVsZC5uYW1lfWA7XG4gICAgICAgICAgICBsZXQgZG9jUGF0aCA9IGAke3BhcmVudERvY1BhdGh9LiR7ZG9jTmFtZX1gO1xuICAgICAgICAgICAgaWYgKGZpZWxkLmFycmF5RGVwdGggPiAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IHN1ZmZpeCA9ICdbKl0nO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGRlcHRoID0gMTA7IGRlcHRoID4gMDsgZGVwdGggLT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzID0gYFskeycqJy5yZXBlYXQoZGVwdGgpfV1gO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZG9jUGF0aC5pbmNsdWRlcyhzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VmZml4ID0gYFskeycqJy5yZXBlYXQoZGVwdGggKyAxKX1dYDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRvY1BhdGggPSBgJHtkb2NQYXRofSR7c3VmZml4fWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzd2l0Y2goZmllbGQudHlwZS5jYXRlZ29yeSkge1xuICAgICAgICAgICAgY2FzZSBcInNjYWxhclwiOlxuICAgICAgICAgICAgICAgIGxldCB0eXBlTmFtZTtcbiAgICAgICAgICAgICAgICBpZiAoZmllbGQudHlwZSA9PT0gc2NhbGFyVHlwZXMuYm9vbGVhbikge1xuICAgICAgICAgICAgICAgICAgICB0eXBlTmFtZSA9ICdib29sZWFuJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IHNjYWxhclR5cGVzLmZsb2F0KSB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGVOYW1lID0gJ251bWJlcic7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09PSBzY2FsYXJUeXBlcy5pbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZU5hbWUgPSAnbnVtYmVyJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IHNjYWxhclR5cGVzLnVpbnQ2NCkge1xuICAgICAgICAgICAgICAgICAgICB0eXBlTmFtZSA9ICd1aW50NjQnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PT0gc2NhbGFyVHlwZXMudWludDEwMjQpIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZU5hbWUgPSAndWludDEwMjQnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGVOYW1lID0gJ3N0cmluZyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGpzLndyaXRlTG4oYHNjYWxhckZpZWxkcy5zZXQoJyR7cGF0aH0nLCB7IHR5cGU6ICcke3R5cGVOYW1lfScsIHBhdGg6ICcke2RvY1BhdGh9JyB9KTtgKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJzdHJ1Y3RcIjpcbiAgICAgICAgICAgIGNhc2UgXCJ1bmlvblwiOlxuICAgICAgICAgICAgICAgIGdlbkpTU2NhbGFyRmllbGRzKGZpZWxkLnR5cGUsIHBhdGgsIGRvY1BhdGgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIGdlbkpTVHlwZVJlc29sdmVyc0ZvclVuaW9uKHR5cGU6IERiVHlwZSkge1xuICAgICAgICBpZiAodHlwZS5jYXRlZ29yeSA9PT0gRGJUeXBlQ2F0ZWdvcnkudW5pb24pIHtcbiAgICAgICAgICAgIGpzLndyaXRlTG4oYCAgICAgICAgJHt0eXBlLm5hbWV9OiAke3R5cGUubmFtZX1SZXNvbHZlcixgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlKHR5cGVzOiBEYlR5cGVbXSkge1xuXG4gICAgICAgIC8vIEdcblxuICAgICAgICBnLndyaXRlQmxvY2tMbihgXG4gICAgICAgIFwiXCJcIlxuICAgICAgICBEdWUgdG8gR3JhcGhRTCBsaW1pdGF0aW9ucyBiaWcgbnVtYmVycyBhcmUgcmV0dXJuZWQgYXMgYSBzdHJpbmcuXG4gICAgICAgIFlvdSBjYW4gc3BlY2lmeSBmb3JtYXQgdXNlZCB0byBzdHJpbmcgcmVwcmVzZW50YXRpb24gZm9yIGJpZyBpbnRlZ2Vycy5cbiAgICAgICAgXCJcIlwiXG4gICAgICAgIGVudW0gQmlnSW50Rm9ybWF0IHtcbiAgICAgICAgICAgIFwiIEhleGFkZWNpbWFsIHJlcHJlc2VudGF0aW9uIHN0YXJ0ZWQgd2l0aCAweCAoZGVmYXVsdCkgXCJcbiAgICAgICAgICAgIEhFWFxuICAgICAgICAgICAgXCIgRGVjaW1hbCByZXByZXNlbnRhdGlvbiBcIlxuICAgICAgICAgICAgREVDXG4gICAgICAgIH1cbiAgICAgICAgYCk7XG4gICAgICAgIFsnU3RyaW5nJywgJ0Jvb2xlYW4nLCAnSW50JywgJ0Zsb2F0J10uZm9yRWFjaChnZW5HU2NhbGFyVHlwZXNGaWx0ZXIpO1xuICAgICAgICBnZW5HRW51bVR5cGVzKCk7XG4gICAgICAgIHR5cGVzLmZvckVhY2godHlwZSA9PiBnZW5HVHlwZURlY2xhcmF0aW9uKHR5cGUpKTtcbiAgICAgICAgY29uc3QgZ0FycmF5RmlsdGVycyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgICAgICB0eXBlcy5mb3JFYWNoKHR5cGUgPT4gZ2VuR0ZpbHRlcih0eXBlLCBnQXJyYXlGaWx0ZXJzKSk7XG5cbiAgICAgICAgY29uc3QgY29sbGVjdGlvbnMgPSB0eXBlcy5maWx0ZXIodCA9PiAhIXQuY29sbGVjdGlvbik7XG4gICAgICAgIGdlbkdRdWVyaWVzKGNvbGxlY3Rpb25zKTtcbiAgICAgICAgZ2VuR1N1YnNjcmlwdGlvbnMoY29sbGVjdGlvbnMpO1xuXG4gICAgICAgIC8vIEpTXG5cbiAgICAgICAganMud3JpdGVCbG9ja0xuKGBcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgc2NhbGFyLFxuICAgICAgICAgICAgYmlnVUludDEsXG4gICAgICAgICAgICBiaWdVSW50MixcbiAgICAgICAgICAgIHJlc29sdmVCaWdVSW50LFxuICAgICAgICAgICAgc3RydWN0LFxuICAgICAgICAgICAgYXJyYXksXG4gICAgICAgICAgICBqb2luLFxuICAgICAgICAgICAgam9pbkFycmF5LFxuICAgICAgICAgICAgZW51bU5hbWUsXG4gICAgICAgICAgICBzdHJpbmdDb21wYW5pb24sXG4gICAgICAgICAgICBjcmVhdGVFbnVtTmFtZVJlc29sdmVyLFxuICAgICAgICAgICAgdW5peE1pbGxpc2Vjb25kc1RvU3RyaW5nLFxuICAgICAgICAgICAgdW5peFNlY29uZHNUb1N0cmluZyxcbiAgICAgICAgfSA9IHJlcXVpcmUoJy4vZGItdHlwZXMuanMnKTtcbiAgICAgICAgYCk7XG4gICAgICAgIGNvbnN0IGpzQXJyYXlGaWx0ZXJzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgICAgIHR5cGVzLmZvckVhY2godHlwZSA9PiBnZW5KU0ZpbHRlcih0eXBlLCBqc0FycmF5RmlsdGVycykpO1xuXG4gICAgICAgIGpzLndyaXRlQmxvY2tMbihgXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZVJlc29sdmVycyhkYikge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgYCk7XG4gICAgICAgIHR5cGVzLmZvckVhY2goKHR5cGUpID0+IHtcbiAgICAgICAgICAgIGdlbkpTQ3VzdG9tUmVzb2x2ZXJzKHR5cGUpO1xuICAgICAgICAgICAgZ2VuSlNUeXBlUmVzb2x2ZXJzRm9yVW5pb24odHlwZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBqcy53cml0ZUxuKCcgICAgICAgIFF1ZXJ5OiB7Jyk7XG4gICAgICAgIGNvbGxlY3Rpb25zLmZvckVhY2goKHR5cGUpID0+IHtcbiAgICAgICAgICAgIGpzLndyaXRlTG4oYCAgICAgICAgICAgICR7dHlwZS5jb2xsZWN0aW9uIHx8ICcnfTogZGIuJHt0eXBlLmNvbGxlY3Rpb24gfHwgJyd9LnF1ZXJ5UmVzb2x2ZXIoKSxgKVxuICAgICAgICB9KTtcbiAgICAgICAganMud3JpdGVMbignICAgICAgICB9LCcpO1xuICAgICAgICBqcy53cml0ZUxuKCcgICAgICAgIFN1YnNjcmlwdGlvbjogeycpO1xuICAgICAgICBjb2xsZWN0aW9ucy5mb3JFYWNoKCh0eXBlKSA9PiB7XG4gICAgICAgICAgICBqcy53cml0ZUxuKGAgICAgICAgICAgICAke3R5cGUuY29sbGVjdGlvbiB8fCAnJ306IGRiLiR7dHlwZS5jb2xsZWN0aW9uIHx8ICcnfS5zdWJzY3JpcHRpb25SZXNvbHZlcigpLGApXG4gICAgICAgIH0pO1xuICAgICAgICBqcy53cml0ZUJsb2NrTG4oYFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGApO1xuXG4gICAgICAgIGpzLndyaXRlQmxvY2tMbihgXG4gICAgICAgIGNvbnN0IHNjYWxhckZpZWxkcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgYCk7XG4gICAgICAgIGNvbGxlY3Rpb25zLmZvckVhY2goKHR5cGUpID0+IHtcbiAgICAgICAgICAgIGdlbkpTU2NhbGFyRmllbGRzKHR5cGUsIHR5cGUuY29sbGVjdGlvbiB8fCAnJywgJ2RvYycpO1xuICAgICAgICB9KTtcblxuICAgICAgICBqcy53cml0ZUJsb2NrTG4oYFxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgIHNjYWxhckZpZWxkcyxcbiAgICAgICAgICAgIGNyZWF0ZVJlc29sdmVycyxcbiAgICAgICAgYCk7XG4gICAgICAgIHR5cGVzLmZvckVhY2godHlwZSA9PiBqcy53cml0ZUxuKGAgICAgJHt0eXBlLm5hbWV9LGApKTtcbiAgICAgICAganMud3JpdGVCbG9ja0xuKGBcbiAgICAgICAgfTtcbiAgICAgICAgYCk7XG4gICAgfVxuXG4gICAgZ2VuZXJhdGUoZGJUeXBlcyk7XG5cbiAgICBmb3IgKGNvbnN0IGU6IEludEVudW1EZWYgb2YgZW51bVR5cGVzLnZhbHVlcygpKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBleHBvcnQgY29uc3QgUSR7ZS5uYW1lfSA9IHtgKTtcbiAgICAgICAgY29uc29sZS5sb2coT2JqZWN0LmVudHJpZXMoZS52YWx1ZXMpLm1hcCgoW25hbWUsIHZhbHVlXSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGAgICAgJHtuYW1lfTogJHsodmFsdWU6IGFueSl9LGA7XG4gICAgICAgIH0pLmpvaW4oJ1xcbicpKTtcbiAgICAgICAgY29uc29sZS5sb2coYH07XFxuYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcWw6IGcuZ2VuZXJhdGVkKCksXG4gICAgICAgIGpzOiBqcy5nZW5lcmF0ZWQoKSxcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1haW47XG4iXX0=