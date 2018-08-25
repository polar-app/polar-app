import {Preconditions} from '../Preconditions';

export class Cmdline {

    static getDocArg(args: string[]) {
        return Cmdline.getArg(args, Cmdline.isDoc);
    }

    static getURLArg(args: string[]) {
        return Cmdline.getArg(args, Cmdline.isURL);
    }

    static getArg(args: string[], filter: (arg: string) => boolean) {

        Preconditions.assertNotNull(filter, "filter");

        if (! (args instanceof Array)) {
            throw new Error("Args not an array");
        }

        let arg: string | null =
            args.filter((arg) => arg != null && filter(arg))
                .reduce((accumulator: string | null, currentValue) => accumulator = currentValue != null ? currentValue : null, null);

        return arg;

    }

    static isDoc(arg: string): boolean {
        return arg.endsWith(".pdf") || arg.endsWith(".chtml") || arg.endsWith(".phz")
    }

    static isURL(arg: string): boolean {
        return arg.startsWith("http:") || arg.startsWith("https:") || arg.startsWith("file:")
    }

}
