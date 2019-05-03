import {Hashcodes} from '../Hashcodes';
import {ImageType} from './Image';
import {PersistenceLayerProvider} from '../datastore/PersistenceLayer';
import {Img} from './Img';
import {Image} from './Image';

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

    public static toImg(persistenceLayerProvider: PersistenceLayerProvider, image?: Image): Img | undefined {

        if (! image) {
            return undefined;
        }

        const persistenceLayer = persistenceLayerProvider();
        const docFileMeta = persistenceLayer.getFile(image.src.backend, image.src);

        const img: Img = {
            width: image.width!,
            height: image.height!,
            src: docFileMeta.url
        };

        return img;

    }

}
