class Caller {

    static getCaller() {
        let callerName;
        let e = new Error();
        let re = /(\w+)@|at (\w+) \(/g;
        let stack = e.stack;
        let m = re.exec(stack);

        console.log("========= BEGIN stack: ===");
        console.log(stack);
        console.log("========= END stack: ===");

        if(m) {
            return m[1] || m[2];
        } else {
            throw new Error("Could not determine caller");
        }


    }

}

module.exports.Caller = Caller;
