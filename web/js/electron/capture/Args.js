
const {ArgsParser} = require("../../util/ArgsParser");
const {Objects} = require("../../util/Objects");

class Args {

    /**
     * Parse the command line, providing reasonable arguments.
     **/
    static parse(argv) {

        let result = ArgsParser.parse(argv);

        result = Objects.defaults(result, {
            quit: true,
            browser: "MOBILE_GALAXY_S8_WITH_CHROME_61"
        });

        return result;

    }

}

module.exports.Args = Args;
