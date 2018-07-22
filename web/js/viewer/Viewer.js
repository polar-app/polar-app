//const {GA} = require("../ga/GA");
const log = require("../logger/Logger").create();
const {Hashcodes} = require("../Hashcodes");
const os = require("os");

class Viewer {

    start() {

        $(document).ready(() => {

        });

    }

    changeScale(scale) {
        throw new Error("Not supported by this viewer.")
    }

}

module.exports.Viewer = Viewer;
