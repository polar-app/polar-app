
type StringifyablePrimitives = string | number | boolean;

interface IStringifyable {
    [key: string]: StringifyablePrimitives | null | undefined | Stringifyable;
}

export type Stringifyable = StringifyablePrimitives | IStringifyable;
