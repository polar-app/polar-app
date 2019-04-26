import {Hashcodes} from '../Hashcodes';
import {ImageType} from './Image';

export class Images {

    public static createID() {
        return Hashcodes.createRandomID(20);
    }

    public static toExt(type: ImageType): string {

        switch (type) {

            case 'image/gif':
                return "gif";
            case 'image/png':
                return "png";
            case 'image/jpeg':
                return "png";
            case 'image/webp':
                return "webp";
            case 'image/svg+xml':
                return "svg";

        }

    }

}
