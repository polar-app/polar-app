class Caller {

    static getCaller() {
        let e = new Error();
        let stack = e.stack;
        let frame = stack.split("\n")[1];
        return Caller._parse(frame);
    }

    /**
     * Parse a specific frame in the stack trace.
     * @param frame {string}
     * @protected
     */
    static _parse(frame) {

        let re = /([^/.]+\.(js|ts|tsx)):[0-9]+:[0-9]+/g;
        let m = re.exec(frame);

        console.log("========= BEGIN stack: ===");
        console.log(frame);
        console.log("========= END stack: ===");

        if(m) {
            return { filename: m[1] };
        } else {
            throw new Error("Could not determine caller");
        }
    }

}

module.exports.Caller = Caller;
