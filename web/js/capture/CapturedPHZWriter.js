/**
 * Writes out a PHZ archive from the given captured JSON data.
 */
const {PHZWriter} = require("../phz/PHZWriter");

class CapturedPHZWriter {


    constructor(path) {
        this.path = path;
    }

    write(captured) {
        new PHZWriter()
    }

}

module.exports.CapturedPHZWriter = CapturedPHZWriter;
