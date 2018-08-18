import {Optional} from '../../../util/ts/Optional';
import {Hashcodes} from '../../../Hashcodes';
import {MediaFile} from './clients/StoreMediaFileClient';

export class MediaContents {

    // <img src="data:image/gif;base64,R0lGODlhEAAQAMQAA"
    // public static parse(content: string): MediaContent {
    //
    //
    //
    // }

    public static parseDataURLs(content: string): string[] {

        let result: string[] = [];

        let re = /src=["'](data:image\/(gif|jpg|png);base64,[^"']+)/g;
        let m;

        while (m = re.exec(content)) {
            result.push(m[1]);
        }

        return result;

    }

    public static toMediaFile(dataURL: string): Optional<MediaFile> {

        let re = /data:image\/(gif|jpg|png);base64,([^"']+)/;
        let m = re.exec(dataURL);

        if(m) {

            let type = m[1];
            let data = m[2];

            let name = Hashcodes.createID(data, 20);
            let filename = `${name}.${type}`;

            return Optional.of({filename, data});

        }

        return Optional.empty();

    }

}
