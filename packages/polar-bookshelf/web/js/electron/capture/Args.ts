import {ArgsParser} from '../../util/ArgsParser';
import {Objects} from "polar-shared/src/util/Objects";


export class Args {

    /**
     * Parse the command line, providing reasonable arguments.
     */
    public static parse(argv: any[]) {

        let result = ArgsParser.parse(argv);

        result = Objects.defaults(result, {
            quit: true,
            browser: "DEFAULT",
            profile: "WEBVIEW",
            amp: true
        });

        return result;

    }

}
