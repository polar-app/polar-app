import {Optional} from '../../../../util/ts/Optional';
import {Hashcodes} from '../../../../Hashcodes';
import {MediaFile} from './clients/StoreMediaFileClient';
import {MediaContent} from './MediaContent';

export class MediaContents {

    public static parse(content: string): MediaContent {

        let mediaFiles: MediaFile[] = [];

        let re = /src=["'](data:image\/(gif|jpg|png);base64,[^"']+)/g;

        content = content.replace(re, (match, p1) => {

            let mediaFile = MediaContents.toMediaFile(p1);

            mediaFiles.push(mediaFile.get());

            return match.replace(p1, mediaFile.get().filename);

        });

        return {
            content, mediaFiles
        }

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
