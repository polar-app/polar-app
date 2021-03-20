export class Dicts {

    /**
     * We iterate over all keys in the dictionary.  Even inherited keys.
     *
     * @param dict
     * @param callback
     */
    static ownKeys<V>(dict: {[key: string]: V} , callback: OwnKeysCallback<V>) {

        for(const key in dict) {

            if(dict.hasOwnProperty(key)) {
                const value = dict[key];
                callback(key,value);
            }

        }

    }

}

interface OwnKeysCallback<V> {

    (key: string, value: V): void;

}
