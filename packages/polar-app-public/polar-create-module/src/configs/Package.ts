export namespace Package {
    export function createV0(name: string, description: string) {
        return {
            "name": name,
            "version": "2.1.107", // TODO: how do we set this now?
            "description": description,
            "scripts": {
                "test": "",
                "mocha": "",
                "eslint": "",
                "compile": ""
            },
            "author": "Polar",
            "license": "ISC"
        }

    }
}
