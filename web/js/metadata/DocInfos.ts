import {DocInfo} from './DocInfo';
import {ISODateTimeStrings} from './ISODateTimeStrings';

export class DocInfos {

    public static create(fingerprint: string, nrPages: number) {

        const tmp: DocInfo = Object.create(DocInfos.prototype);

        tmp.fingerprint = fingerprint;
        tmp.nrPages = nrPages;
        tmp.added = ISODateTimeStrings.create();

        return new DocInfo(tmp);

    }

}
