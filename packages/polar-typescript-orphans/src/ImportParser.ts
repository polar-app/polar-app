export namespace ImportParser {

    export function parse(data: string) {

        // const re = /import(?:["'\s]*([\w*{}\n\r\t, ]+)from\s*)?["'\s].*([@\w_-]+)["'\s].*;$/gm;

        const re = /import(?:["'\s]*([\w*{}\n\r\t, ]+)from\s*)?["'\s](.*([@\w_-]+))["'\s].*;?$/gm;
        const result = data.matchAll(re);

        if (result) {
            return [...result].map(current => current[2]);
        }

        return [];

    }

}
