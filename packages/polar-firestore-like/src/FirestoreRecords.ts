export namespace FirestoreRecords {

    /**
     *
     * Recursively work through this object and remove any fields that are
     * stored with undefined values.  This is primarily because Firebase doesn't
     * support undefined.
     *
     * Additionally, we convert all arrays to dictionaries with number keys (as
     * strings) to better support Firestore arrays which don't really map to
     * Javascript arrays properly.
     *
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export function convert(dict: any): Record<string, unknown> {

        if (dict === undefined || dict === null) {
            // nothing to do here.
            return dict;
        }

        if (typeof dict !== 'object') {
            // if we're not a dictionary we're done
            return dict;
        }

        if (Array.isArray(dict)) {

            const result: any = {};

            dict.forEach((current, idx) => {
                result[idx] = convert(current);
            });

            return result;

        } else {

            const result: any = {};

            for (const key of Object.keys(dict).sort()) {
                const value = dict[key];

                if (value === undefined) {
                    continue;
                }

                result[key] = convert(value);
            }

            return result;

        }

    }


}
