/* eslint-disable no-use-before-define */
// @flow

// Def

export type DocContentDef = string | { md: string } | { html: string };

export type DocDef = { _doc?: DocContentDef }

export type ClassDef = {
    types?: MembersDef<TypeDef>,
    fields?: MembersDef<TypeDef>,
    functions?: MembersDef<FunctionDef>
}

export type IntSizeType = 8 | 16 | 32 | 64 | 128 | 256;

export type TypeDef = DocDef & {
    _void?: {},
    _any?: {},
    _ref?: string,
    _bool?: {},
    _time?: {},
    _string?: {},
    _float?: { size?: 32 | 64 },
    _int?: { unsigned?: boolean, size?: IntSizeType },
    _array?: TypeDef,
    _struct?: MembersDef<TypeDef>,
    _union?: MembersDef<TypeDef>,
    _class?: ClassDef,
    _value?: string | number | boolean,
}

export type FunctionDef = DocDef & {
    args?: OrderedMembersDef<TypeDef>,
    result?: TypeDef,
}

export type UnorderedMembersDef<M> = {
    [string]: M
}

export type OrderedMembersDef<M> = UnorderedMembersDef<M>[]

export type MembersDef<M> = OrderedMembersDef<M> | UnorderedMembersDef<M>

export const Def = {
    void_(doc?: DocContentDef): TypeDef {
        return { _void: {}, ...(doc ? { _doc: doc } : {}) }
    },
    any(doc?: DocContentDef): TypeDef {
        return { _any: {}, ...(doc ? { _doc: doc } : {}) }
    },
    int(doc?: DocContentDef): TypeDef {
        return { _int: {}, ...(doc ? { _doc: doc } : {}) }
    },
    float(doc?: DocContentDef): TypeDef {
        return { _float: {}, ...(doc ? { _doc: doc } : {}) }
    },
    string(doc?: DocContentDef): TypeDef {
        return { _string: {}, ...(doc ? { _doc: doc } : {}) }
    },
    bool(doc?: DocContentDef): TypeDef {
        return { _bool: {}, ...(doc ? { _doc: doc } : {}) }
    },
    time(doc?: DocContentDef): TypeDef {
        return { _time: {}, ...(doc ? { _doc: doc } : {}) }
    },
    arrayOf(item: TypeDef, doc?: DocContentDef): TypeDef {
        return { _array: item, ...(doc ? { _doc: doc } : {}) }
    },
    unionOf(members: MembersDef<TypeDef>, doc?: DocContentDef): TypeDef {
        return { _union: members, ...(doc ? { _doc: doc } : {}) }
    },
    ref(nameOrType: string | { [string]: TypeDef }, doc?: DocContentDef): TypeDef {
        const name = typeof nameOrType === 'string' ? nameOrType : Object.keys(nameOrType)[0];
        return { _ref: name, ...(doc ? { _doc: doc } : {}) };
    },
    value(value: string, doc?: DocContentDef): TypeDef {
        return { _value: value, ...(doc ? { _doc: doc } : {}) }
    },
};

// Schema
function isReservedKey(key: string): boolean {
    return key === '_doc' || key === "_";
}

export type SchemaDoc = {
    doc?: (string | { md: string } | { html: string })
}

export type SchemaClass = {
    types: SchemaMember<SchemaType>[],
    fields: SchemaMember<SchemaType>[],
    functions: SchemaMember<SchemaFunction>[]
}

export type SchemaType = SchemaDoc & {
    void?: {},
    any?: {},
    int?: { unsigned?: boolean, size?: IntSizeType },
    float?: { size?: (32 | 64) },
    string?: {},
    bool?: {},
    time?: {},
    array?: SchemaType,
    struct?: SchemaMember<SchemaType>[],
    union?: SchemaMember<SchemaType>[],
    ref?: { name: string, type: SchemaType },
    class?: SchemaClass,
    value?: string | number | boolean
}

export type SchemaFunction = SchemaDoc & {
    args: SchemaMember<SchemaType>[],
    result: SchemaType,
}

export type SchemaMember<M> = { name: string } & M

// Parser

export function parseTypeDef(def: TypeDef): SchemaType {
    const parser = new SchemaParser();
    return parser.parseTypeDef(def, '');
}

// Internals

type ParsingType = {
    type: SchemaType,
    unresolved: { name: string, type: SchemaType }[],
}

function combineName(base: string, name: string): string {
    return base !== '' ? `${base}.${name}` : name;
}

const UnresolvedType: SchemaType = {
    void: {},
    doc: '',
};

class SchemaParser {
    types: { [string]: ParsingType };

    constructor() {
        this.types = {};
    }

    typeRef(def: TypeDef): SchemaType {
        const defRef = def._ref || '';
        const existing = this.types[defRef];
        if (existing) {
            if (existing.type !== UnresolvedType) {
                return { ref: { name: defRef, type: existing.type } }
            }
            const ref = { name: defRef, type: UnresolvedType };
            existing.unresolved.push(ref);
            return { ref };
        }
        const ref = { name: defRef, type: UnresolvedType };
        this.types[defRef] = { type: UnresolvedType, unresolved: [ref] };
        return { ref };
    }

    resolveType(name: string, type: SchemaType) {
        const existing = this.types[name];
        if (existing) {
            existing.unresolved.forEach(x => x.type = type);
        }
        this.types[name] = { type, unresolved: [] };
    }

    namedMembersFromUnorderedDefs<D, S>(
        defs: UnorderedMembersDef<D>,
        mapMember: (memberName: string, memberDef: D) => S
    ): SchemaMember<S>[] {
        return Object.keys(defs).map<SchemaMember<S>>((memberName: string): SchemaMember<S> => {
            const memberDef = defs[memberName];
            return {
                name: memberName,
                ...mapMember(memberName, memberDef)
            };
        });
    }

    namedMembersFromOrderedDefs<D, S>(
        defs: OrderedMembersDef<D>,
        mapMember: (name: string, def: D) => S
    ): SchemaMember<S>[] {
        const members: SchemaMember<S>[] = [];
        defs.forEach((unorderedDefs: UnorderedMembersDef<D>) => {
            this.namedMembersFromUnorderedDefs(unorderedDefs, mapMember).forEach((member: SchemaMember<S>) => {
                members.push(member)
            })
        });
        return members;
    }

    namedMembers<D, S>(
        defs: MembersDef<D>,
        mapMember: (name: string, def: D) => S
    ): SchemaMember<S>[] {
        return Array.isArray(defs)
            ? this.namedMembersFromOrderedDefs(defs, mapMember)
            : this.namedMembersFromUnorderedDefs(defs, mapMember);
    }

    typedNamedMembers<D: TypeDef>(memberDefs: MembersDef<D>, name: string): SchemaMember<SchemaType>[] {
        return this.namedMembers<D, SchemaType>(memberDefs, (memberName: string, memberDef: D): SchemaType => {
            return this.parseTypeDef(memberDef, combineName(name, memberName));
        });
    }

    typedNamedOrderedMembers<D: TypeDef>(memberDefs: OrderedMembersDef<D>, name: string): SchemaMember<SchemaType>[] {
        return this.namedMembersFromOrderedDefs<D, SchemaType>(memberDefs, (memberName: string, memberDef: D): SchemaType => {
            return this.parseTypeDef(memberDef, combineName(name, memberName));
        });
    }


    parseTypeDef(def: TypeDef, name: string): SchemaType {
        const scalarTypes = ['_void', '_any', '_int', '_float', '_string', '_bool', '_time'];
        if (!def) {
            console.log('>>>', name, def);
        }
        let type: any = {
            def,
            doc: def._doc || '',
            _: def._ || {},
        };
        const scalarType = scalarTypes.find(t => t in def);
        if (scalarType) {
            Object.assign(type, def);
            type[scalarType.substr(1)] = def[scalarType];
        } else if (def._ref) {
            Object.assign(type, this.typeRef((def: any)));
        } else if (def._array) {
            type.array = this.parseTypeDef(def._array, combineName(name, 'item'));
        } else if (def._struct) {
            type.struct = this.typedNamedMembers(def._struct, name);
        } else if (def._union) {
            type.union = this.namedMembers(def._union, (memberName, memberDef) => {
                return memberDef._value
                    ? memberDef
                    : this.parseTypeDef(memberDef, combineName(name, memberName));
            });
        } else if (def._class) {
            const classDef = def._class;
            type.class = {
                types: classDef.types ? this.typedNamedMembers(classDef.types, name) : [],
                fields: classDef.fields ? this.typedNamedMembers(classDef.fields, name) : [],
                functions: classDef.functions ? this.namedMembers(classDef.functions, (functionName, functionDef: FunctionDef) => {
                    return {
                        def: functionDef,
                        doc: functionDef._doc || '',
                        args: functionDef.args
                            ? this.typedNamedOrderedMembers(functionDef.args, combineName(name, functionName))
                            : [],
                        result: functionDef.result
                            ? this.parseTypeDef(functionDef.result, combineName(name, 'Result'))
                            : { doc: '', void: {} }
                    }
                }) : [],
            }
        } else if (Array.isArray(def)) {
            type.struct = this.typedNamedMembers((def: any), name);
        } else if (typeof def === 'object') {
            const filteredDef = {};
            Object.keys(def).forEach((key) => {
                if (!isReservedKey(key)) {
                    filteredDef[key] = def[key];
                }
            });
            type.struct = this.typedNamedMembers((filteredDef: any), name);
        } else {
            console.log('>>>', name);
        }
        this.resolveType(name, type);
        return type;
    }
}

