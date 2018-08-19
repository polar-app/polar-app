import {Preconditions} from '../Preconditions';

export class Dictionaries {

    static values<T>(dict: {[key: string]: T} | undefined | null): T[] {

        let result: T[] = [];

        if(! dict) {
            // TODO: this can go away once we migrate to typescript everywhere
            return result;
        }

        return Object.values(dict);

    }

    /**
     * We iterate over all keys in the dictionary
     *
     * @param dict
     * @param callback
     */
    static forDict<T>(dict: {[key: string]: T}, callback: ForDictCallbackFunction<T> ) {

        Preconditions.assertNotNull(dict, "dict");
        Preconditions.assertNotNull(callback, "callback");

        for(let key in dict) {

            if(dict.hasOwnProperty(key)) {
                let value = dict[key];
                callback(key,value);
            }

        }

    }

}

interface ForDictCallbackFunction<T> {
    (key: string, value: T): void;
}

