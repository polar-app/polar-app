import {DocInfo, IDocInfo} from './DocInfo';
import {ISODateTimeStrings} from './ISODateTimeStrings';
import {Optional} from '../util/ts/Optional';
import {UUIDs} from './UUIDs';

export class DocInfos {

    public static create(fingerprint: string, nrPages: number, filename?: string) {

        const tmp: DocInfo = Object.create(DocInfos.prototype);

        tmp.fingerprint = fingerprint;
        tmp.nrPages = nrPages;
        tmp.added = ISODateTimeStrings.create();
        tmp.filename = filename;
        tmp.uuid = UUIDs.create();

        return new DocInfo(tmp);

    }

    /**
     * Get the best possible title from the doc info but fall back to filename
     * if one isn't available and then 'Untitled' after that.
     */
    public static bestTitle(docInfo: IDocInfo) {

        return Optional.first(docInfo.title,
                              docInfo.filename)
            .validateString()
            .getOrElse('Untitled');

    }

}
