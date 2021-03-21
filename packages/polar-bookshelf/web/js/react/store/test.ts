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
// export const DEFAULT_MAPPER = <V, M>(value: V) => (value as unknown) as M;
// //
// export function doFoo<V, M>(value: V, mapper: (value: V) => M = DEFAULT_MAPPER): M {
//     return mapper(value);
// }
//
// const bar = doFoo(1, value => value + 1);


// interface IOpts<V, M> {
//     readonly mapper: (value: V) => M;
// }
//
//
// import {IStorePrefs} from "./ObservableStore";
//
// // FIXME: how do I specify the store here..
// interface IFooStore {
//     readonly cat: string;
//     readonly dog: string;
// }
//
// interface PrefsHandler {
//
// }
//
// function pick<T, K extends keyof T>(value: T, keys: ReadonlyArray<K>): Pick<T, K> {
//
//     const result: any = {};
//
//     for (const key of keys) {
//         result[key] = value[key];
//     }
//
//     return result;
//
// }
