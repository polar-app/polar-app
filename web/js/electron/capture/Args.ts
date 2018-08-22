import {ArgsParser} from '../../util/ArgsParser';
import {Objects} from '../../util/Objects';


export class Args {

    /**
     * Parse the command line, providing reasonable arguments.
     **/
    static parse(argv: any[]) {

        let result = ArgsParser.parse(argv);

        result = Objects.defaults(result, {
            quit: true,
            browser: "DEFAULT",
            profile: "default",
            amp: true
        });

        return result;

    }

}
