export class FunctionalInterface {

    /**
     * Create a functional interface for the given object so that a function OR
     * an object can be used.  We prefer the object form.
     */
    public static create(name: string, object: any) {

        if (!object[name] && typeof object === "function") {
            const functionalInterface: any = {};
            functionalInterface[name] = object;

            return functionalInterface;
        }

        return object;

    }

}
