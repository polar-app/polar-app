import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {AreaHighlight} from './AreaHighlight';
import {
    ISODateTimeString,
    ISODateTimeStrings
} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Image} from './Image';
import {Datastore} from '../datastore/Datastore';
import {PersistenceLayer} from '../datastore/PersistenceLayer';
import {Images} from './Images';
import {DocMetas} from './DocMetas';
import {Backend} from 'polar-shared/src/datastore/Backend';
import {ArrayBuffers} from 'polar-shared/src/util/ArrayBuffers';
import {Attachment} from './Attachment';
import {AreaHighlightRect} from './AreaHighlightRect';
import {
    HighlightRects,
    Position
} from "polar-shared/src/metadata/IBaseHighlight";
import {DatastoreFileCache} from '../datastore/DatastoreFileCache';
import {ICapturedScreenshot} from '../screenshots/Screenshot';
import {ILTRect} from 'polar-shared/src/util/rects/ILTRect';
import {DataURLs} from 'polar-shared/src/util/DataURLs';
import {Rects} from '../Rects';
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {IImage} from "polar-shared/src/metadata/IImage";
import {BackendFileRef} from "polar-shared/src/datastore/BackendFileRef";

export class AreaHighlights {

    public static update(id: string,
                         docMeta: IDocMeta,
                         pageMeta: IPageMeta,
                         updates: Partial<IAreaHighlight>) {

        const existing = pageMeta.areaHighlights[id]!;

        if (!existing) {
            throw new Error("No existing for id: " + id);
        }

        const updated = new AreaHighlight({...existing, ...updates});
        pageMeta.areaHighlights[id] = updated;

    }

    public static toCorrectScale2(overlayRect: ILTRect, currentScale: number) {

        // we have to scale these number BACK to their original
        // positions at 100%

        const rescaleFactor = 1 / currentScale;

        return Rects.scale(Rects.createFromBasicRect(overlayRect), rescaleFactor);

    }


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

        const id = AreaHighlights.createID(created);
        return new AreaHighlight({

            // per-pagemark fields.
            id,
            guid: id,

            created,

            // there is only one rect for an area highlight.
            rects: { "0": opts.rect }

        });

    }

    public static createWriter(opts: AreaHighlightWriteOpts): AreaHighlightWriter {
        return new DefaultAreaHighlightWriter(opts);
    }

    public static async delete(opts: AreaHighlightDeleteOpts) {

        const {datastore, docMeta, pageMeta, areaHighlight} = opts;
        const {image} = areaHighlight;

        DocMetas.withBatchedMutations(docMeta, () => {

            delete pageMeta.areaHighlights[areaHighlight.id];

            if (image) {
                delete docMeta.docInfo.attachments[image.id];
            }

        });

        if (image) {
            await datastore.deleteFile(image.src.backend, image.src);
        }

    }

}

export interface DoWriteOpts {
    readonly datastore: PersistenceLayer;
    readonly docMeta: IDocMeta;
    readonly pageMeta: IPageMeta;
    readonly pageNum: number;
    readonly areaHighlight: AreaHighlight;
    readonly target: HTMLElement;
    readonly areaHighlightRect: AreaHighlightRect;
    readonly boxRect: ILTRect;
}

export interface AreaHighlightDeleteOpts {
    readonly datastore: Datastore | PersistenceLayer;
    readonly docMeta: IDocMeta;
    readonly pageMeta: IPageMeta;
    readonly areaHighlight: IAreaHighlight;

}

export interface AreaHighlightWriteOpts {
    readonly datastore: PersistenceLayer;
    readonly docMeta: IDocMeta;
    readonly pageMeta: IPageMeta;
    readonly areaHighlight: IAreaHighlight;
    readonly areaHighlightRect: AreaHighlightRect;
    readonly position: Position;
    readonly capturedScreenshot: ICapturedScreenshot;
}

export interface AreaHighlightWriter {

    prepare(): [AreaHighlight, AreaHighlightCommitter];

}

class DefaultAreaHighlightWriter implements AreaHighlightWriter {

    constructor(private readonly opts: AreaHighlightWriteOpts) {
        Preconditions.assertPresent(opts, 'opts');
        Preconditions.assertPresent(opts.capturedScreenshot, 'opts.capturedScreenshot');
    }

    public prepare(): [AreaHighlight, AreaHighlightCommitter] {

        const {docMeta, capturedScreenshot, pageMeta, areaHighlight, areaHighlightRect, position} = this.opts;

        Preconditions.assertPresent(capturedScreenshot, 'capturedScreenshot');

        const {type, width, height} = capturedScreenshot;

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
        //  - write out the metadata to memory without writing to the datastore
        //
        //  - write the new file
        //
        //  - write the new DocMeta to the datastore
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

        const oldImage = areaHighlight.image;

        const image = new Image({
            id, type, width, height,
            rel: 'screenshot',
            src: fileRef,
        });

        const toBlob = () => {

            if (typeof capturedScreenshot.data === 'string') {
                return DataURLs.toBlob(capturedScreenshot.data);
            } else {
                return ArrayBuffers.toBlob(capturedScreenshot.data);
            }

        };

        const blob = toBlob();

        const blobURL = URL.createObjectURL(blob);

        DatastoreFileCache.writeFile(Backend.IMAGE, image.src, {
            url: blobURL
        });

        // update the DocMeta but don't write yet.  We have to make sure the
        // write of the image made to the datastore first.

        if (areaHighlight.image) {
            delete docMeta.docInfo.attachments[areaHighlight.image.id];
        }

        docMeta.docInfo.attachments[image.id] = new Attachment({fileRef});

        const rects: HighlightRects = {};
        rects["0"] = <any> areaHighlightRect;

        const newAreaHighlight = new AreaHighlight({
            ...areaHighlight,
            image,
            rects,
            position,
            lastUpdated: ISODateTimeStrings.create()
        });

        delete pageMeta.areaHighlights[areaHighlight.id];
        pageMeta.areaHighlights[newAreaHighlight.id] = newAreaHighlight;

        const committer = new DefaultAreaHighlightCommitter(this.opts, image, blob, oldImage);

        return [newAreaHighlight, committer];

    }

}


export interface AreaHighlightCommitter {

    commit(): Promise<void>;

}

class DefaultAreaHighlightCommitter implements AreaHighlightCommitter {

    constructor(private readonly opts: AreaHighlightWriteOpts,
                private readonly image: Image,
                private readonly blob: Blob,
                private readonly oldImage: IImage | undefined) {
    }

    public async commit(): Promise<void> {

        const {datastore, docMeta} = this.opts;
        const {image, oldImage, blob} = this;

        const writeFilePromise = datastore.writeFile(image.src.backend, image.src, blob);

        const deleteFilePromise = oldImage ? datastore.deleteFile(oldImage.src.backend, oldImage.src) : Promise.resolve()

        const writeDocMetaPromise = datastore.writeDocMeta(docMeta);

        await Promise.all([
            writeFilePromise,
            deleteFilePromise,
            writeDocMetaPromise
        ]);

    }

}

interface IAreaHighlightOpts {
    readonly rect?: any;
}
