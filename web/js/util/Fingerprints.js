const {Hashcodes} = require("../Hashcodes")

class Fingerprints {

    /**
     * Parse the fingerprint from the filename.
     */
    static fromFilename(filename) {
        let match = filename.match(/-([^-]+)\.[^.]+$/);
        return match[1];
    }

    /**
     * Remove the extension from a file, add the fingerprint, then add the
     * extension again.
     * @param path
     */
    static toFilename(path, fingerprint) {
        let index = path.lastIndexOf(".");

        let prefix = path.substring(0,index);
        let suffix = path.substring(index+1, path.length);

        return `${prefix}-${fingerprint}.${suffix}`;
    }

    /**
     * Create a fingerprint from the given data.
     *
     * @param data
     */
    static create(data) {
        return Hashcodes.create(data).substring(0,20);
    }

}

module.exports.Fingerprints = Fingerprints;
