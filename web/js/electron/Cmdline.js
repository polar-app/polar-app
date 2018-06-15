class Cmdline {

    static getPDFArg(args) {

        if (! args instanceof Array) {
            throw new Error("Args not an array");
        }

        let pdfArg = args.filter((arg) => arg != null && Cmdline.isDoc(arg))
                         .reduce((accumulator, currentValue) => accumulator = currentValue != null? currentValue : null, null);

        return pdfArg;

    }

    static isDoc(arg) {
        return arg.endsWith(".pdf") || arg.endsWith(".chtml")
    }

};

module.exports.Cmdline = Cmdline;
