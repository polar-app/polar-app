export class Filenames {

    /**
     * Create a sane filename from the given input.  Do not allow bad characters
     * which may not be represented in a file.
     */
    static sanitize(filename: string): string {

        return filename.replace(/[^a-z0-9_]/gi, '_');

    }

}
