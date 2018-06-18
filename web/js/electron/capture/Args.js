class Args {

    /**
     * Parse..
     *
     * @param args
     */
    static parse(argv) {

        let result = {

            // do not quit when we are done.
            noQuit: argv.includes("--no-quit=true")

        };

        return result;

    }

}

module.exports.Args = Args;
