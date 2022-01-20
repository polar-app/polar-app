export class Callers {

    public static getCaller() {

        const e = new Error();
        const stack = e.stack;

        if (stack === undefined) {
            throw new Error("No stack on error");
        }

        const frame = stack.split("\n")[3];

        const result = Callers._parse(frame);

        return result;
    }

    /**
     * Parse a specific frame in the stack trace.
     */
    public static _parse(frame: string) {

        // TODO: probably better to put this into a filter, execute all of them,
        // and them return the results together.

        const javascriptCaller = Callers.parseRE(frame, /([^/.\\)]+\.(js|ts|tsx|jsx)):[0-9]+:[0-9]+\)?$/g);

        // this returns the first match with a space at the end.
        const webpackCaller = Callers.parseRE(frame, /([^/.\\)]+\.(js|ts|tsx|jsx))( |\?)?/g);

        if (webpackCaller) {
            return webpackCaller;
        }

        if (javascriptCaller) {
            return javascriptCaller;
        }

        return {filename: "unknown"};

    }

    private static parseRE(frame: string, re: RegExp): Caller | undefined {

        const m = re.exec(frame);

        if (m) {
            return { filename: m[1] };
        } else {
            return undefined;
        }

    }

}

export interface Caller {
    filename: string;
}

