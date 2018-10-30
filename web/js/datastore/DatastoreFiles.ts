export class DatastoreFiles {

    /**
     * Make sure the file name is sane ... nothing that can't be encoded
     * as a file and must have a three letter extension.  We should just have
     * the files be alphanumeric for now and support a 3-4 char suffix.
     */
    public static isValidFileName(name: string): boolean {

        // FIXME: unicode characters too...

        // FIXME: there are two strategies here..
        // - blacklist
        //
        // - whitelist
        //
        //   - harder to accept unicode alphanumeric now


        // / \ : * ? " < > |

        return name.search(/^[a-zA-Z0-9_(),{} -]+(\.[a-zA-Z0-9]{3,4})?$/g) !== -1;

    }
    public static assertValidFileName(name: string) {

        if (! this.isValidFileName(name)) {
            throw new Error("Invalid file name: " + name);
        }

    }

}
