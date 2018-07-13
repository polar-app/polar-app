const {Clock} = require("./Clock.js");

class SystemClock extends Clock {

    getDate() {
        return new Date();
    }

}

module.exports.SystemClock = SystemClock;
