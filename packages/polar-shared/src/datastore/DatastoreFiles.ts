import {FileRef} from "./FileRef";
import {Preconditions} from "../Preconditions";

export namespace DatastoreFiles {

    /**
     * Make sure the file name is sane ... nothing that can't be encoded
     * as a file and must have a three letter extension.  We should just have
     * the files be alphanumeric for now and support a 3-4 char suffix.
     */
    export function isValidFileName(name: string): boolean {
        return name.search(/^[a-zA-Z0-9_(),{} -]+(\.[a-zA-Z0-9]{3,4})?$/g) !== -1;
    }

    export function assertValidFileName(ref: FileRef) {

        if (! isValidFileName(ref.name)) {
            throw new Error("Invalid file name: " + ref.name);
        }

    }

    /**
     * Blacklist model to accept a string for a filename and strip characters
     * that are invalid and not accepted on most filesystems.
     *
     * @param name
     */
    export function sanitizeFileName(name: string) {
        return name.replace(/[/\\:*?\"<>|]/g, '_');
    }

    export function isSanitizedFileName(name: string) {
        Preconditions.assertPresent(name, "name");
        return name.search(/[/\\:*?\"<>|]/) === -1;
    }

    export function assertSanitizedFileName(ref: FileRef) {
        if (! isSanitizedFileName(ref.name)) {
            throw new Error("Invalid file name: " + ref.name);
        }
    }

}
