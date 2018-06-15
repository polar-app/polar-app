module.exports.Cmdline = class {

    static getPDFArg(args) {

        if (! args instanceof Array) {
            throw new Error("Args not an array");
        }

        let pdfArg = args.filter((arg) => arg != null && arg.endsWith(".pdf"))
                         .reduce((accumulator, currentValue) => accumulator = currentValue != null? currentValue : null, null);

        return pdfArg;

    }

};
