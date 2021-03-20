import deepEquals from "react-fast-compare";

type Dict = {[key: string]: any};

export namespace Equals {

    export function shallow(a: Dict, b: Dict): boolean {

        if (a === b) {
            // the easiest case where they are both object.
            return true;
        }

        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);

        if (aKeys.length !== bKeys.length) {
            // they have obviously different number of keys
            return false;
        }

        // we HAVE to check the names of the keys in the index because
        // if we don't there might be null values in a different
        // dictionary which would be indistinguishable from missing

        for (let idx = 0; idx < aKeys.length; ++idx) {
            if(aKeys[idx] !== bKeys[idx]) {
                return false;
            }
        }

        for(const key of aKeys) {

            if(a[key] !== b[key]) {
                return false;
            }

        }

        return true;

    }

    export function deep(a: Dict, b: Dict): boolean {
        return deepEquals(a, b);
    }

}