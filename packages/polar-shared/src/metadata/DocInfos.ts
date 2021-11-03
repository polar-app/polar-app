import {DocInfo} from './DocInfo';
import {ISODateTimeStrings} from './ISODateTimeStrings';
import {UUIDs} from './UUIDs';
import {PagemarkType} from './PagemarkType';
import {IDocInfo} from "./IDocInfo";
import {Strings} from '../util/Strings';

export class DocInfos {

    public static create(fingerprint: string, nrPages: number, filename?: string) {

        const tmp: IDocInfo = Object.create(DocInfos.prototype);

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
    public static bestTitle(docInfo: IDocInfo): string {
        const { title, filename } = docInfo;

        if (! Strings.empty(title)) {
            return title;
        }

        if (! Strings.empty(filename)) {
            return filename;
        }

        return "Untitled";
    }

    public static upgrade(docInfo: IDocInfo) {

        if (! docInfo) {
            // return whatever we were given (either undefined or null)
            return docInfo;
        }

        if (!docInfo.attachments) {
            docInfo.attachments = {};
        }

        if (!docInfo.pagemarkType) {
            // log.debug("DocInfo has no pagemarkType... Adding default of SINGLE_COLUMN");
            docInfo.pagemarkType = PagemarkType.SINGLE_COLUMN;
        }

        return docInfo;

    }

}
