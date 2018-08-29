import {DocInfo} from './DocInfo';
import {ISODateTime} from './ISODateTime';

export class DocInfos {

    public static create(fingerprint: string, nrPages: number) {

        let tmp: DocInfo = Object.create(DocInfos.prototype);

        tmp.fingerprint = fingerprint;
        tmp.nrPages = nrPages;
        tmp.added = new ISODateTime(new Date());

        return new DocInfo(tmp);

    }

}
