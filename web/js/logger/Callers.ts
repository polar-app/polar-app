export class Callers {

    static getCaller() {
        let e = new Error();
        let stack = e.stack;

        if( stack === undefined) {
            throw new Error("No stack on error");
        }

        let frame = stack.split("\n")[3];
        let result = Callers._parse(frame);

        return result;
    }

    /**
     * Parse a specific frame in the stack trace.
     * @protected
     */
    static _parse(frame: string) {

        // TODO: probably better to put this into a filter, execute all of them,
        // and them return the results together.

        let javascriptCaller = Callers.parseRE(frame, /([^/.\\)]+\.(js|ts|tsx|jsx)):[0-9]+:[0-9]+\)?$/g);

        // this returns the first match with a space at the end.
        let webpackCaller = Callers.parseRE(frame, /([^/.\\)]+\.(js|ts|tsx|jsx))( |\?)/g);

        if(webpackCaller) {
            return webpackCaller;
        }

        if(javascriptCaller)
            return javascriptCaller;

        throw new Error(`Could not determine caller from frame: '${frame}'`);

    }

    static parseRE(frame: string, re: RegExp): Caller | undefined {

        let m = re.exec(frame);

        if(m) {
            return { filename: m[1] };
        } else {
            return undefined;
        }

    }

}

export interface Caller {
    filename: string;
}

