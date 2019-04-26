import {Hashcodes} from '../Hashcodes';
import {Preconditions} from '../Preconditions';
import {AreaHighlight} from './AreaHighlight';
import {ISODateTimeString, ISODateTimeStrings} from './ISODateTimeStrings';
import {DocMeta} from './DocMeta';
import {ExtractedImage} from '../util/Canvases';
import {Image} from './Image';
import {Datastore} from '../datastore/Datastore';
import {BackendFileRef} from '../datastore/Datastore';
import {PersistenceLayer} from '../datastore/PersistenceLayer';
import {Images} from './Images';
import {DocMetas} from './DocMetas';
import {Backend} from '../datastore/Backend';
import {IImage} from './Image';
import {ArrayBuffers} from '../util/ArrayBuffers';
import {Attachment} from './Attachment';

export class AreaHighlights {

    public static createID(created: ISODateTimeString) {
        // TODO: this needs some unique data and random is probably find.
        return Hashcodes.createID(created);
    }

    /**
     * Create a new pagemark with the created time, and other mandatory fields
     * added.
     *
     * @param opts
     * @return {AreaHighlight}
     */
    public static create(opts: IAreaHighlightOpts = {}) {

        Preconditions.assertNotNull(opts.rect, "rect");

        const created = ISODateTimeStrings.create();

        return new AreaHighlight({

            // per-pagemark fields.
            id: AreaHighlights.createID(created),

            created,

            // there is only one rect for an area highlight.
            rects: { "0": opts.rect }

        });

    }


    public static async attachScreenshots(datastore: Datastore | PersistenceLayer,
                                          docMeta: DocMeta,
                                          areaHighlight: AreaHighlight,
                                          extractedImage: ExtractedImage) {

        // FIXME: deleting an area highlight should remove its attachment too
        // and be within a batch operation.

        const {type, width, height} = extractedImage;

        const id = Images.createID();
        const ext = Images.toExt(type);

        const fileRef: BackendFileRef = {
            // TODO: add the data hashcode
            backend: Backend.IMAGE,
            name: `${id}.${ext}`
        };

        const blob = ArrayBuffers.toBlob(extractedImage.data);

        // we must first write the data to the datastore.
        await datastore.writeFile(fileRef.backend, fileRef, blob);

        DocMetas.withBatchedMutations(docMeta, () => {

            const image: IImage = {
                rel: 'screenshot',
                src: fileRef,
                type, width, height
            };

            docMeta.docInfo.attachments[id] = new Attachment({fileRef});

            // FIXME: remove the old rel=screenshot image.

            // FIXME: now update the area highlight by sticking the new image
            // on...

        });

    }

}

interface IAreaHighlightOpts {
    readonly rect?: any;
}
