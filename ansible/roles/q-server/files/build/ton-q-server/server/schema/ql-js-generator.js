//@flow

import {Writer} from './gen.js';
import type {TypeDef} from './schema.js';
import type {DbField, DbType, IntEnumDef} from './db-schema-types';
import {
    DbTypeCategory,
    isBigInt, parseDbSchema,
    scalarTypes,
    stringifyEnumValues,
    toEnumStyle,
} from './db-schema-types';

function main(schemaDef: TypeDef) {
    const { types: dbTypes, enumTypes} = parseDbSchema(schemaDef);

// Generators

    const g = new Writer();
    const js = new Writer();

    function genGDoc(prefix: string, doc: string) {
        if (doc.trim() === '') {
            return;
        }
        const lines = doc.split(/\n\r?|\r\n?/);
        if (lines.length === 1 && !lines[0].includes('"')) {
            g.writeLn(prefix, '"', lines[0], '"');
        } else {
            g.writeLn(prefix, '"""');
            lines.forEach((line) => {
                g.writeLn(prefix, line);
            });
            g.writeLn(prefix, '"""');
        }
    }

    function unionVariantType(type: DbType, variant: DbField): string {
        return `${type.name}${variant.name}Variant`;
    }

    function genGTypeDeclarationsForUnionVariants(type: DbType) {
        type.fields.forEach((variant) => {
            g.writeBlockLn(`
        type ${unionVariantType(type, variant)} {
            ${variant.name}: ${variant.type.name}
        }

        `);
        });
    }

    function genGEnumTypes() {
        for (const enumDef: IntEnumDef of enumTypes.values()) {
            g.writeLn(`enum ${enumDef.name}Enum {`);
            Object.keys(enumDef.values).forEach((name) => {
                g.writeLn(`    ${toEnumStyle(name)}`);
            });
            g.writeLn(`}`);
            g.writeLn();
        }
    }

    function genGTypeDeclaration(type: DbType) {
        if (type.category === DbTypeCategory.union) {
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
                const typeDeclaration =
                    '['.repeat(field.arrayDepth) +
                    field.type.name +
                    ']'.repeat(field.arrayDepth);
                let params = '';
                if (isBigInt(field.type)) {
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

    function preventTwice(name: string, names: Set<string>, work: () => void) {
        if (!names.has(name)) {
            names.add(name);
            work();
        }
    }

    function genGFiltersForArrayFields(type: DbType, gNames: Set<string>) {
        type.fields.forEach((field) => {
            let itemTypeName = field.type.name;
            for (let i = 0; i < field.arrayDepth; i += 1) {
                const filterName = `${itemTypeName}ArrayFilter`;
                preventTwice(filterName, gNames, () => {
                    g.writeLn(`input ${filterName} {`);
                    ['any', 'all'].forEach((op) => {
                        g.writeLn(`\t${op}: ${itemTypeName}Filter`);
                    });
                    g.writeLn('}');
                    g.writeLn();

                });
                itemTypeName += 'Array';
            }
        });
    }

    function genGFiltersForEnumNameFields(type: DbType, gNames: Set<string>) {
        type.fields.forEach((field) => {
            const enumDef = field.enumDef;
            if (enumDef) {
                preventTwice(`${enumDef.name}EnumFilter`, gNames, () => {
                    genGScalarTypesFilter(`${enumDef.name}Enum`);
                });
            }
        });
    }

    function genGFilter(type: DbType, gNames: Set<string>) {
        if (type.fields.length === 0) {
            return;
        }
        genGFiltersForArrayFields(type, gNames);
        genGFiltersForEnumNameFields(type, gNames);
        genGDoc('', type.doc);
        g.writeLn(`input ${type.name}Filter {`);
        type.fields.forEach((field) => {
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

    function genGScalarTypesFilter(name: string) {
        g.writeLn(`input ${name}Filter {`);
        ['eq', 'ne', 'gt', 'lt', 'ge', 'le'].forEach((op) => {
            g.writeLn(`\t${op}: ${name}`);
        });
        ['in', 'notIn'].forEach((op) => {
            g.writeLn(`\t${op}: [${name}]`);
        });
        g.writeLn('}');
        g.writeLn();
    }

    function genGQueries(types: DbType[]) {
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

        types.forEach((type: DbType) => {
            g.writeLn(`\t${type.collection || ''}(filter: ${type.name}Filter, orderBy: [QueryOrderBy], limit: Int, timeout: Float, accessKey: String, operationId: String): [${type.name}]`);
        });

        g.writeBlockLn(`
        }

        `);
    }

    function genGSubscriptions(types: DbType[]) {
        g.writeLn('type Subscription {');
        types.forEach((type) => {
            g.writeLn(`\t${type.collection || ''}(filter: ${type.name}Filter, accessKey: String): ${type.name}`);
        });
        g.writeLn('}');
    }


    function getScalarResolverName(field: DbField): string {
        if (field.type === scalarTypes.uint64) {
            return 'bigUInt1';
        }
        if (field.type === scalarTypes.uint1024) {
            return 'bigUInt2';
        }
        return 'scalar';
    }

    function genJSFiltersForArrayFields(type: DbType, jsNames: Set<string>) {
        type.fields.forEach((field) => {
            let itemTypeName = field.type.name;
            for (let i = 0; i < field.arrayDepth; i += 1) {
                const filterName = `${itemTypeName}Array`;
                preventTwice(filterName, jsNames, () => {
                    const itemResolverName = (i === 0 && field.type.category === DbTypeCategory.scalar)
                        ? getScalarResolverName(field)
                        : itemTypeName;
                    js.writeBlockLn(`
                const ${filterName} = array(() => ${itemResolverName});
                `);
                });
                itemTypeName += 'Array';
            }
        });
    }

    function genJSStructFilter(type: DbType) {
        js.writeBlockLn(`
        const ${type.name} = struct({
    `);
        type.fields.forEach((field: DbField) => {
            let typeDeclaration: ?string = null;
            const join = field.join;
            if (join) {
                const suffix = field.arrayDepth > 0 ? 'Array' : '';
                typeDeclaration = `join${suffix}('${join.on}', '${join.refOn}', '${field.type.collection || ''}', () => ${field.type.name})`;
            } else if (field.arrayDepth > 0) {
                typeDeclaration =
                    field.type.name +
                    'Array'.repeat(field.arrayDepth);
            } else if (field.type.category === DbTypeCategory.scalar) {
                typeDeclaration = getScalarResolverName(field);
            } else if (field.type.fields.length > 0) {
                typeDeclaration = field.type.name;
            }
            if (typeDeclaration) {
                js.writeLn(`    ${field.name}: ${typeDeclaration},`);
                const enumDef = field.enumDef;
                if (enumDef) {
                    js.writeLn(`    ${field.name}_name: enumName('${field.name}', ${stringifyEnumValues(enumDef.values)}),`);
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

    function genJSUnionResolver(type: DbType) {
        js.writeBlockLn(`
        const ${type.name}Resolver = {
            __resolveType(obj, context, info) {
        `);
        type.fields.forEach((variant) => {
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

    function genJSFilter(type: DbType, jsNames: Set<string>) {
        if (type.fields.length === 0) {
            return;
        }
        if (type.category === DbTypeCategory.union) {
            // genJSFiltersForUnionVariants(type, jsNames);
        }
        genJSFiltersForArrayFields(type, jsNames);
        genJSStructFilter(type);
        if (type.category === DbTypeCategory.union) {
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
    function genJSCustomResolvers(type: DbType) {
        const joinFields = type.fields.filter(x => !!x.join);
        const bigUIntFields = type.fields.filter((x: DbField) => isBigInt(x.type));
        const stringFormattedFields = type.fields.filter((x: DbField) => x.formatter);
        const enumFields = type.fields.filter(x => x.enumDef);
        const customResolverRequired = type.collection
            || joinFields.length > 0
            || bigUIntFields.length > 0
            || enumFields.length > 0;
        if (!customResolverRequired) {
            return;
        }
        js.writeLn(`        ${type.name}: {`);
        if (type.collection) {
            js.writeLn('            id(parent) {');
            js.writeLn('                return parent._key;');
            js.writeLn('            },');
        }
        joinFields.forEach((field) => {
            const join = field.join;
            if (!join) {
                return;
            }
            const onField = type.fields.find(x => x.name === join.on);
            if (!onField) {
                throw 'Join on field does not exist.';
            }
            const on = join.on === 'id' ? '_key' : (join.on || '_key');
            const refOn = join.refOn === 'id' ? '_key' : (join.refOn || '_key');
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
        bigUIntFields.forEach((field) => {
            const prefixLength = field.type === scalarTypes.uint64 ? 1 : 2;
            js.writeLn(`            ${field.name}(parent, args) {`);
            js.writeLn(`                return resolveBigUInt(${prefixLength}, parent.${field.name}, args);`);
            js.writeLn(`            },`);
        });
        stringFormattedFields.forEach((field) => {
            js.writeLn(`            ${field.name}_string(parent, args) {`);
            js.writeLn(`                return ${field.formatter || ''}(parent.${field.name});`);
            js.writeLn(`            },`);
        });
        enumFields.forEach((field) => {
            const enumDef = field.enumDef;
            if (enumDef) {
                js.writeLn(`            ${field.name}_name: createEnumNameResolver('${field.name}', ${stringifyEnumValues(enumDef.values)}),`);
            }
        });
        js.writeLn(`        },`);
    }

    function genJSScalarFields(type: DbType, parentPath, parentDocPath: string) {
        type.fields.forEach((field: DbField) => {
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
            switch(field.type.category) {
            case "scalar":
                let typeName;
                if (field.type === scalarTypes.boolean) {
                    typeName = 'boolean';
                } else if (field.type === scalarTypes.float) {
                    typeName = 'number';
                } else if (field.type === scalarTypes.int) {
                    typeName = 'number';
                } else if (field.type === scalarTypes.uint64) {
                    typeName = 'uint64';
                } else if (field.type === scalarTypes.uint1024) {
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


    function genJSTypeResolversForUnion(type: DbType) {
        if (type.category === DbTypeCategory.union) {
            js.writeLn(`        ${type.name}: ${type.name}Resolver,`);
        }
    }

    function generate(types: DbType[]) {

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
        const gArrayFilters = new Set<string>();
        types.forEach(type => genGFilter(type, gArrayFilters));

        const collections = types.filter(t => !!t.collection);
        genGQueries(collections);
        genGSubscriptions(collections);

        // JS

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
        const jsArrayFilters = new Set<string>();
        types.forEach(type => genJSFilter(type, jsArrayFilters));

        js.writeBlockLn(`
        function createResolvers(db) {
            return {
        `);
        types.forEach((type) => {
            genJSCustomResolvers(type);
            genJSTypeResolversForUnion(type);
        });
        js.writeLn('        Query: {');
        collections.forEach((type) => {
            js.writeLn(`            ${type.collection || ''}: db.${type.collection || ''}.queryResolver(),`)
        });
        js.writeLn('        },');
        js.writeLn('        Subscription: {');
        collections.forEach((type) => {
            js.writeLn(`            ${type.collection || ''}: db.${type.collection || ''}.subscriptionResolver(),`)
        });
        js.writeBlockLn(`
                }
            }
        }

        `);

        js.writeBlockLn(`
        const scalarFields = new Map();
        `);
        collections.forEach((type) => {
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

    for (const e: IntEnumDef of enumTypes.values()) {
        console.log(`export const Q${e.name} = {`);
        console.log(Object.entries(e.values).map(([name, value]) => {
            return `    ${name}: ${(value: any)},`;
        }).join('\n'));
        console.log(`};\n`);
    }

    return {
        ql: g.generated(),
        js: js.generated(),
    }
}

export default main;
