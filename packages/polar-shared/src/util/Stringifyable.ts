
// type StringifyablePrimitives = string | number | boolean;
//
// interface IStringifyable {
//     [key: string]: StringifyablePrimitives | null | undefined | Stringifyable;
// }
//
// export type Stringifyable = StringifyablePrimitives | IStringifyable;


// type StringifyablePrimitive = null | boolean |number | string;
// type StringifyableValue = StringifyablePrimitive |Stringifyable | Array<StringifyablePrimitive|Stringifyable>;
// export interface Stringifyable extends Record<string, StringifyableValue> {}


type StringifyablePrimitive = null | boolean |number | string;
type StringifyableValue<K> = StringifyablePrimitive |Stringifyable<K> | Array<StringifyablePrimitive|Stringifyable<K>>;
export interface Stringifyable<K> extends Record<string, StringifyableValue<K>> {}
