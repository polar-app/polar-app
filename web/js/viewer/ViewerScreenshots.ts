import {Screenshots} from "../screenshots/Screenshots";
import {IDimensions} from "polar-shared/src/util/IDimensions";
import {Optional} from "polar-shared/src/util/ts/Optional";
import {Canvases, ResizedImage, ResizeOpts} from "polar-shared/src/util/Canvases";
import {DataURLs} from "polar-shared/src/util/DataURLs";
import {ArrayBuffers} from "polar-shared/src/util/ArrayBuffers";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {Backend} from "polar-shared/src/datastore/Backend";
import {IThumbnail} from "polar-shared/src/metadata/IThumbnail";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Model} from "../model/Model";
import {Logger} from "polar-shared/src/logger/Logger";
import {FileRef} from "polar-shared/src/datastore/FileRef";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {DocMetas} from "../metadata/DocMetas";
import {isPresent} from "polar-shared/src/Preconditions";

const log =  Logger.create();

export class ViewerScreenshots {

    private static documentDimensions(): IDimensions {

        const viewerContainer = Optional.of(document.querySelector("#viewerContainer"))

        const width = viewerContainer.map(current => current.clientWidth).getOrElse(0);
        const height = viewerContainer.map(current => current.clientHeight).getOrElse(0);

        return {width, height};

    }

    /**
     * Return true if we can create a screenshot of this document.
     */
    private static supportsScreenshot(docMeta: IDocMeta): boolean {

        // *** if there are any pagemarks then there's nothing we can do here.
        for (const pageMeta of Object.values(docMeta.pageMetas)) {

            if (pageMeta.pagemarks && Object.keys(pageMeta.pagemarks).length > 0) {
                return false;
            }

        }

        if (!docMeta.docInfo.added) {
            // we don't know when this document was created
            return false;
        }

        // if (TimeDurations.hasElapsed(docMeta.docInfo.added, '5m')) {
        //     // this is an older document and we can't use it.
        //     return false;
        // }

        return true;

    }

    private static hasThumbnail(model: Model): boolean {

        const docMeta = model.docMeta;

        return docMeta.docInfo.thumbnails !== undefined && isPresent(docMeta.docInfo.thumbnails['default']);

    }

    public static doScreenshot(model: Model) {

        if (! this.supportsScreenshot(model.docMeta)) {
            log.info("This document doesn't support screenshots");
            return;
        }

        if (this.hasThumbnail(model)) {
            log.info("We already have a thumbnail");
            return;
        }

        // TODO only do this on documents that are NEW now legacy documents.

        const handler = async () => {

            const thumbnailResizedImage = await this.createThumbnail();

            await this.writeThumbnail(thumbnailResizedImage, model);

        };

        handler().catch(err => log.error("Unable to capture screenshot", err));

    }

    private static async writeThumbnail(thumbnailResizedImage: ResizedImage, model: Model) {

        const persistenceLayer = model.persistenceLayerProvider();

        const decodedDataURL = DataURLs.decode(thumbnailResizedImage.dataURL);

        const blob = ArrayBuffers.toBlob(decodedDataURL.data);

        const id = Hashcodes.createRandomID();

        const fileRef: FileRef = {
            name: `${id}.png`
        };

        await persistenceLayer.writeFile(Backend.IMAGE, fileRef, blob);

        const thumbnail: IThumbnail = {
            id,
            created: ISODateTimeStrings.create(),
            type: 'image/png',
            src: {
                backend: Backend.IMAGE,
                ...fileRef
            },
            width: thumbnailResizedImage.size.width,
            height: thumbnailResizedImage.size.height,
            rel: 'thumbnail'
        };

        const docMeta = model.docMeta;

        DocMetas.withBatchedMutations(docMeta, () => {

            const docInfo = model.docMeta.docInfo;

            if (!docInfo.thumbnails) {
                docInfo.thumbnails = {};
                docInfo.thumbnails['default'] = thumbnail;
            }

        });

        log.notice("Wrote new thumbnail ...");

    }

    private static async createThumbnail() {

        const element = <HTMLElement>document.querySelector("#viewerContainer");

        const dimensions = this.documentDimensions();

        const screenshot = await Screenshots.capture(1, {left: 0, top: 0, ...dimensions}, element);

        const CROP_WIDTH = 250;
        const CROP_HEIGHT = Math.floor(CROP_WIDTH / (850 / 1100));

        const targetDimensions = {width: CROP_WIDTH, height: CROP_HEIGHT};

        const opts: ResizeOpts = {keepAspectRatio: true, type: 'image/png', quality: 1.0};
        return await Canvases.resize(screenshot.data, targetDimensions, opts);

    }

}

