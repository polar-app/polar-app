import {DocInfo} from './DocInfo';
import {ISODateTimeStrings} from './ISODateTimeStrings';

export class DocInfos {

    public static create(fingerprint: string, nrPages: number, filename?: string) {

        const tmp: DocInfo = Object.create(DocInfos.prototype);

        tmp.fingerprint = fingerprint;
        tmp.nrPages = nrPages;
        tmp.added = ISODateTimeStrings.create();
        tmp.filename = filename;

        return new DocInfo(tmp);

    }

}
