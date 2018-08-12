
export class Dictionaries {

    static values<T>(dict: {[key: string]: T} | undefined | null): T[] {

        let result: T[] = [];

        if(! dict) {
            return result;
        }

        return Object.values(dict);

    }

}
