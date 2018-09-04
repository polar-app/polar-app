import {DocInfo} from './DocInfo';
import {ISODateTimes} from './ISODateTimes';

export class DocInfos {

    public static create(fingerprint: string, nrPages: number) {

        let tmp: DocInfo = Object.create(DocInfos.prototype);

        tmp.fingerprint = fingerprint;
        tmp.nrPages = nrPages;
        tmp.added = ISODateTimes.create();

        return new DocInfo(tmp);

    }

}
