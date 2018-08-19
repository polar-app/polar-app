export class Objects {

    /**
     * Take the current object, and use given object as a set of defaults.
     */
    static defaults(current: any, defaults: any) {

        let result = current;

        if (!result) {
            result = {};
        }

        for(let key in defaults) {
            if(defaults.hasOwnProperty(key) && ! result.hasOwnProperty(key)) {
                result[key] = defaults[key];
            }
        }

        return result;

    }

    /**
     * Clear an array or dictionary of all its values so it is reset.
     * This modifies the object directly.
     *
     * @param obj
     */
    static clear(obj: any) {

        if(obj instanceof Array) {

            for(let idx = 0; idx < obj.length; ++idx) {
                obj.pop();
            }

            return obj;

        }

        if(typeof obj === "object") {

            for(let key in obj) {
                delete obj[key];
            }

            return obj;

        }

        throw new Error("Only works for arrays or objects");

    }

    static duplicate(obj: any) {
        return JSON.parse(JSON.stringify(obj));
    }

    static create<T>(proto: any): T {
        return Object.create(proto);
    }

    /**
     * Create an instance of an object from its prototype and use some Typescript
     * generic promotion to make it work properly.
     */
    static createInstance<T>(prototype: T, val: any) {
        let result: T = Objects.create(prototype);
        Object.assign(result, val);
        return result;
    }

}


function create<T>(proto: any): T {
    return Object.create(proto);
}

function createInstance<T>(prototype: T, val: any) {
    let result: T = create(prototype);
    Object.assign(result, val);
    return result;
}

