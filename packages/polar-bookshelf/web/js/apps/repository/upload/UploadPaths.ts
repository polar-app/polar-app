export namespace UploadPaths {

    export function parse(path: string): string | undefined {

        const re = new RegExp("/?(([^/]+/)*)[^/]+");
        const match = path.match(re);

        if (match && match[1] !== '') {

            const result = match[1];

            if (result.endsWith("/")) {
                return result.substring(0, result.length - 1);
            } else {
                return result;
            }

        } else {
            return undefined;
        }

    }

}
