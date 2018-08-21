export interface Listener<V> {
    (value: V): void;
}
