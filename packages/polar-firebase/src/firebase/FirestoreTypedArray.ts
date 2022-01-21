
export type FirestoreValue = FirestoreDict | FirestoreArray | FirestorePrimitive;

/**
 * An array type that accepts.  This syntax prevents .includes() from working since it's
 * not actually a real dictionary.
 */
export interface FirestoreArray {
    readonly [id: number]: FirestoreDict | FirestoreArray | FirestorePrimitive;
}

/**
 * The type of primitives that Firestore supports.
 */
export type FirestorePrimitive = string | number | boolean | null;

export interface FirestoreTypedArray<T extends FirestorePrimitive | FirestoreDict | FirebaseDictTyped<T>> {
    readonly [id: number]: T;
}

export type FirebaseDictTyped<T> = {
    readonly [P in keyof T]: FirestorePrimitive;
};

export interface FirestoreDict {
    readonly [id: string]: FirestoreDict | FirestoreArray | FirestorePrimitive | FirebaseDictTyped<any>;
}
