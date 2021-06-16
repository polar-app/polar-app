import React from "react";
import {DataURLs} from "polar-shared/src/util/DataURLs";
import {URLStr} from "polar-shared/src/util/Strings";
import {Blobs} from "polar-shared/src/util/Blobs";
import {Elements} from "../../util/Elements";
import {HTMLToBlocks, IBlockContentStructure} from "../HTMLToBlocks";
import {Images} from "polar-shared/src/util/Images";

export interface IPasteImageData {
    readonly url: URLStr;
    readonly width: number;
    readonly height: number;
}

export interface IPasteHandlerOpts {
    readonly onPasteImage: (image: IPasteImageData) => void;
    readonly onPasteBlocks: (blocks: ReadonlyArray<IBlockContentStructure>) => void; 
    readonly onPasteError: (err: Error) => void;
}

export type PasteImageType =
    'image/webp' |
    'image/png' |
    'image/jpeg' |
    'image/gif' |
    'image/svg+xml' |
    'image/avif' |
    'image/apng';

interface IPasteItemForImage {
    readonly kind: 'image';
    readonly type: PasteImageType;
    readonly dataTransferItem: DataTransferItem;
}

interface IPasteItemForHTML {
    readonly kind: 'html';
    readonly dataTransferItem: DataTransferItem;
}

interface IPasteItemForUnknown {
    readonly kind: 'unknown'
    readonly type: string;
}

export type PasteItem = IPasteItemForImage | IPasteItemForHTML | IPasteItemForUnknown;

function toPasteItem(item: DataTransferItem): PasteItem {
    switch (item.type) {
        case 'image/webp':
        case 'image/png':
        case 'image/jpeg':
        case 'image/gif':
        case 'image/svg+xml':
        case 'image/avif':
        case 'image/apng':
            return {
                kind: 'image',
                type: item.type,
                dataTransferItem: item,
            };

        case 'text/html':
            return {
                kind: 'html',
                dataTransferItem: item,
            };

        default:
            return {
                kind: 'unknown',
                type: item.type,
            };

    }

}

type PasteType = PasteItem['kind'];
type PasteTypesMap = { [K in PasteItem as K['kind']]: K };

const isPasteType = (xs: ReadonlyArray<PasteItem>, type: PasteType) => xs.some(x => x.kind === type);
const getPasteItem = <T extends PasteType>(xs: ReadonlyArray<PasteItem>, type: T) =>
    xs.find((item): item is PasteTypesMap[T] => item.kind === type)

/**
 * Clipboard paste handler that takes clipboard data given to us via an onPaste
 * handler, then handles it directly.
 */
export function usePasteHandler(opts: IPasteHandlerOpts) {

    const {onPasteImage, onPasteBlocks, onPasteError} = opts;

    return React.useCallback((event: React.ClipboardEvent) => {

        // TODO: we need to handle other type's of pastes including
        //
        // PDF, just raw links...
        // text, etc.

        const pasteItems = Array.from(event.clipboardData.items)
                                .map(toPasteItem);

        async function extractImage() {

            const imageItem = getPasteItem(pasteItems, 'image');
            if (imageItem) {
                const file = imageItem.dataTransferItem.getAsFile()

                if (file) {

                    const ab = await Blobs.toArrayBuffer(file)
                    const dataURL = DataURLs.encode(ab, imageItem.type);

                    // const resolution = await ImageResolutions.compute(file);

                    const dimensions = await Images.getDimensions(dataURL);

                    const image: IPasteImageData = {
                        url: dataURL,
                        ...dimensions
                    }

                    onPasteImage(image);

                }
            }

        }

        async function extractHTML() {
            const htmlItem = getPasteItem(pasteItems, 'html');
            if (htmlItem) {
                const getHTMLString = (): Promise<string> => new Promise((resolve) => (
                    htmlItem.dataTransferItem.getAsString(resolve)
                ));
                const html = await getHTMLString();
                const blocks = await HTMLToBlocks.parse(html);
                onPasteBlocks(blocks);
            }
        }

        if (isPasteType(pasteItems, 'image')) {
            event.preventDefault();
            extractImage().catch(err => onPasteError(err));
        } else if (isPasteType(pasteItems, 'html')) {
            event.preventDefault();
            extractHTML().catch(err => onPasteError(err));
        }

    }, [onPasteError, onPasteImage, onPasteBlocks])

}
