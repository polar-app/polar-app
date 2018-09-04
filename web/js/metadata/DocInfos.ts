import {DocInfo} from './DocInfo';

export class DocInfos {

    public static create(fingerprint: string, nrPages: number) {

        let tmp: DocInfo = Object.create(DocInfos.prototype);

        tmp.fingerprint = fingerprint;
        tmp.nrPages = nrPages;

        return new DocInfo(tmp);

    }

}
