import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {DocIDStr, DocRef} from "polar-shared/src/groups/DocRef";
import {Tag} from "polar-shared/src/tags/Tags";
import {ISODateString, ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";

export class DocRefs {

    public static convertFromDocInfo(docID: DocIDStr, docInfo: IDocInfo): DocRef {

        return {
            docID,
            fingerprint: docInfo.fingerprint,
            title: docInfo.title || "",
            subtitle: docInfo.subtitle,
            nrPages: docInfo.nrPages,
            description: docInfo.description,
            url: docInfo.url,
            tags: docInfo.tags,
            published: docInfo.published,
            doi: docInfo.doi
        };

    }

}
