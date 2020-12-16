// interface IOpts<V, M> {
//     readonly mapper: (value: V) => M;
// }
//
// export const DEFAULT_MAPPER = <V, M extends V>(value: V) => value;
//
// export function doFoo<V, M>(value: V, mapper: (value: V) => M = DEFAULT_MAPPER): M {
//     return mapper(value);
// }
//
// const bar = doFoo(1, value => value + 1);


// interface IOpts<V, M> {
//     readonly mapper: (value: V) => M;
// }
//
export const DEFAULT_MAPPER = <V, M>(value: V) => (value as unknown) as M;
//
export function doFoo<V, M>(value: V, mapper: (value: V) => M = DEFAULT_MAPPER): M {
    return mapper(value);
}

const bar = doFoo(1, value => value + 1);


// interface IOpts<V, M> {
//     readonly mapper: (value: V) => M;
// }
//
