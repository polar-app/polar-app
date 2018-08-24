import {Hashcodes} from '../Hashcodes';
import {Resource} from './Resource';

export class ResourceFactory {

    static create(url: string, contentType: string) {

        let id = Hashcodes.createID(url, 20);
        let created = new Date().toISOString();
        let meta = {};
        let headers = {};
        return new Resource({id, url, created, meta, contentType, headers});

    }

    static contentTypeToExtension(contentType: string) {
        if(contentType === "text/html") {
            return "html";
        } else {
            return "dat";
        }
    }

}
