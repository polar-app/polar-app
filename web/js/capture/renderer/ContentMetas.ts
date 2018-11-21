import {ContentMeta} from "./ContentMeta";
import {isPresent} from '../../Preconditions';
import {Optional} from "../../util/ts/Optional";
import {Logger} from "../../logger/Logger";

const log = Logger.create();

class AggregateParser implements ContentMetaParser {

    private readonly delegates: ContentMetaParser[] = [
        new TwitterCardParser()
    ];

    public parse(doc: Document): Readonly<ContentMeta> {

        const results =
            this.delegates.map(current => {

                try {
                    return current.parse(doc);
                } catch (e) {
                    // don't allow these to throw exceptions...
                    log.error("Unable to parse doc: ", e);
                    return createNullContentMeta();
                }

            });

        const result = createNullContentMeta();

        result.title = Optional.first(...results.map(current => current.title)).getOrUndefined();
        result.title = Optional.first(...results.map(current => current.description)).getOrUndefined();

        return result;

    }

}
export class ContentMetas {

    private static readonly parser = new AggregateParser();

    public static parse(doc: Document): Readonly<ContentMeta> {
        return this.parser.parse(doc);
    }

}

interface ContentMetaParser {

    parse(doc: Document): Readonly<ContentMeta>;

}


class TwitterCardParser implements ContentMetaParser {

    public parse(doc: Document): ContentMeta {
        const result = createNullContentMeta();

        result.title = metaValue(doc, 'twitter:title').getOrUndefined();
        result.description = metaValue(doc, 'twitter:description').getOrUndefined();

        return result;
    }

}

function createNullContentMeta(): ContentMeta {

    const result: ContentMeta = {
        title: undefined,
        description: undefined
    };

    return result;

}

function metaValue(doc: Document, name: string): Optional<string> {

    const optionalMetaElement = meta(doc, name);

    if (! optionalMetaElement.isPresent()) {
        return Optional.empty();
    }

    const metaElement = optionalMetaElement.get();

    let content = metaElement.getAttribute("content");

    if (isPresent(content)) {
        return Optional.of(content);
    }

    content = metaElement.getAttribute("value");

    return Optional.of(content);

}


function meta(doc: Document, name: string): Optional<Element> {

    let match = doc.querySelector(`meta[name=${name}]`);

    if (!match ) {
        match = doc.querySelector(`meta[property=${name}]`);
    }

    if (!match ) {
        match = doc.querySelector(`meta[itemprop=${name}]`);
    }

    return Optional.of(match);

}

