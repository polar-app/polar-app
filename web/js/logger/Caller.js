class Caller {

    static getCaller() {
        let e = new Error();
        let stack = e.stack;

        let frame = stack.split("\n")[3];
        let result = Caller._parse(frame);
        return result;
    }

    /**
     * Parse a specific frame in the stack trace.
     * @param frame {string}
     * @protected
     */
    static _parse(frame) {

        // TODO: probably better to put this into a filter, execute all of them,
        // and them return the results together.

        let javascriptCaller = Caller.parseRE(frame, /([^/.)]+\.(js|ts|tsx)):[0-9]+:[0-9]+\)$/g);

        // this returns the first match with a space at the end.
        let webpackCaller = Caller.parseRE(frame, /([^/.)]+\.(js|ts|tsx))( |\?)/g);

        if(webpackCaller) {
            return webpackCaller;
        }

        if(javascriptCaller)
            return javascriptCaller;

        throw new Error(`Could not determine caller from frame: '${frame}'`);

    }

    static parseRE(frame, re) {

        let m = re.exec(frame);

        if(m) {
            return { filename: m[1] };
        } else {
            return null;
        }

    }

}

module.exports.Caller = Caller;
