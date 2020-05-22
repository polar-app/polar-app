import isEqual from "react-fast-compare";

export namespace DeepEquals {

    export function debug(a: any, b: any): void {

        console.log('=== comparing values: ', a, b);

        if (! isEqual(Object.keys(a), Object.keys(b))) {
            console.log("keys differ: ", Object.keys(a), Object.keys(b));
            return;
        }

        const keys = Object.keys(a);

        let broken = false;

        console.log("Comparing keys: ", keys)

        for (const key of keys) {

            if (! isEqual(a[key], b[key])) {
                console.log(`values for key: ${key} differ: `, a[key], b[key]);
                broken = true;
            }

        }

        if (! broken) {
            console.log("objects are equal");
        }

    }

    export function debugIsEqual(a: any, b: any) {
        debug(a, b);
        return isEqual(a, b);
    }

}
