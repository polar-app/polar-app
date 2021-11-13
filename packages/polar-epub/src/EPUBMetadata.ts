import {PathOrURLStr} from "polar-shared/src/util/Strings";
import {IParsedDocMeta} from "polar-shared/src/util/IParsedDocMeta";

export namespace EPUBMetadata {

    export async function getMetadata(docPathOrURL: PathOrURLStr): Promise<IParsedDocMeta> {

        const parser = Parsers.getParser();

        return parser(docPathOrURL);

    }

}

namespace Parsers {

    type Parser = (docPathOrURL: PathOrURLStr) => Promise<IParsedDocMeta>

    let parser: Parser | undefined;

    function isNode() {
        return typeof window === 'undefined';
    }

    function requireParserModule(moduleName: string): any {

        const modulePath = `./${moduleName}`

        const module = require(modulePath);

        if (! module) {
            throw new Error("Could not require module: " + moduleName);
        }

        if (! module[moduleName]) {
            throw new Error(`No moduleName ${moduleName} property in module`);
        }

        return module[moduleName];

    }

    function requireParser(moduleName: string): Parser {
        const module = requireParserModule(moduleName);

        if (! module.getMetadata) {
            throw new Error(`No getMetadata function on moduleName ${moduleName}`);
        }

        return module.getMetadata;

    }

    function createParser(): Parser {
        if (isNode()) {
            return requireParser('EPUBMetadataUsingNode');
        } else {
            return requireParser('EPUBMetadataUsingBrowser');
        }
    }

    export function getParser() {

        if (parser) {
            return parser;
        }

        return parser = createParser();

    }

}
