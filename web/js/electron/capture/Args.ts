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
            browser: "MOBILE_GALAXY_S8_WITH_CHROME_61_WIDTH_750",
            profile: "default",
            amp: false
        });

        return result;

    }

}
