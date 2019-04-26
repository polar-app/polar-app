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
import {ArrayBuffers} from '../util/ArrayBuffers';
import {Attachment} from './Attachment';
import {Logger} from '../logger/Logger';
import {PageMeta} from './PageMeta';
import {AreaHighlightRect} from './AreaHighlightRect';
import {HighlightRects} from './BaseHighlight';

const log = Logger.create();

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


    public static async write(datastore: Datastore | PersistenceLayer,
                              docMeta: DocMeta,
                              pageMeta: PageMeta,
                              areaHighlight: AreaHighlight,
                              rect: AreaHighlightRect,
                              extractedImage: ExtractedImage): Promise<AreaHighlight> {

        const {type, width, height} = extractedImage;

        const id = Images.createID();
        const ext = Images.toExt(type);

        const fileRef: BackendFileRef = {
            // TODO: add the data hashcode
            backend: Backend.IMAGE,
            name: `${id}.${ext}`
        };

        // WARN: THE OPERATIONS HERE ARE ORDERED FOR SAFETY
        //
        // They MUST go in the following manner:
        //
        //  - write the new file
        //
        //  - write the new DocMeta
        //
        //  - delete the old file (this does not need to block)
        //
        //  This CAN live a dangling older file if the write is aborted or the
        //  client crashes but this is probably rare.  It could ALSO leave a NEW
        //  file in place but it won't leave inconsistent/broken data from a
        //  user perspective.
        //
        //  The only way around the danging binary file issue might be some sort
        //  of 'tag' operation where we write the files deletable before we
        //  delete them.

        const blob = ArrayBuffers.toBlob(extractedImage.data);
        await datastore.writeFile(fileRef.backend, fileRef, blob);

        const oldImage = areaHighlight.image;

        const result = DocMetas.withBatchedMutations(docMeta, () => {

            if (areaHighlight.image) {
                delete docMeta.docInfo.attachments[areaHighlight.image.id];
            }

            const image = new Image({
                id, type, width, height,
                rel: 'screenshot',
                src: fileRef,
            });

            docMeta.docInfo.attachments[image.id] = new Attachment({fileRef});

            const rects: HighlightRects = {};

            rects["0"] = <any> rect;

            const newAreaHighlight =  new AreaHighlight({...areaHighlight, image, rects});

            delete pageMeta.areaHighlights[areaHighlight.id];
            pageMeta.areaHighlights[newAreaHighlight.id] = newAreaHighlight!;

            return newAreaHighlight;

        });

        if (oldImage) {
            datastore.deleteFile(oldImage.src.backend, oldImage.src)
                .catch(err => log.error("Unable to delete old image: ", err, oldImage));
        }

        return result;

    }

}

interface IAreaHighlightOpts {
    readonly rect?: any;
}
