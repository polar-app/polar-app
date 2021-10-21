import React from "react";
import {URLStr} from "polar-shared/src/util/Strings";
import {HTMLToBlocks, IBlockContentStructure} from "../HTMLToBlocks";
import {useUploadHandler} from "../UploadHandler";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";

export interface IPasteImageData {
    readonly url: URLStr;
    readonly width: number;
    readonly height: number;
}

export interface IPasteHandlerOpts {
    readonly onPasteImage: (image: IPasteImageData) => void;
    readonly onPasteBlocks: (blocks: ReadonlyArray<IBlockContentStructure>) => void;
    readonly onPasteError: (err: unknown) => void;
    readonly onPasteText: (text: string) => void;
    readonly id: BlockIDStr;
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

interface IPasteItemForText {
    readonly kind: 'text';
    readonly dataTransferItem: DataTransferItem;
}

interface IPasteItemForUnknown {
    readonly kind: 'unknown';
    readonly type: string;
}

interface IPasteItemForPolarBlocks {
    readonly kind: 'polarblocks';
    readonly dataTransferItem: DataTransferItem;
}

export type PasteItem =
    IPasteItemForImage |
    IPasteItemForHTML |
    IPasteItemForPolarBlocks |
    IPasteItemForText |
    IPasteItemForUnknown;

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

        case 'text/plain':
            return {
                kind: 'text',
                dataTransferItem: item,
            };

        case 'application/polarblocks+json':
            return {
                kind: 'polarblocks',
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

const getPasteItem = <T extends PasteType>(xs: ReadonlyArray<PasteItem>, type: T) =>
    xs.find((item): item is PasteTypesMap[T] => item.kind === type)



type PasteHandler = {
    type: PasteType;
    handler: () => Promise<void>;
};

const executePasteHandlers = async (
    handlers: ReadonlyArray<PasteHandler>,
    onError: (err: unknown) => void,
) => {
    for (const {handler, type} of handlers) {
        try {
            await handler();
        } catch (e) {
            console.error(`Error: Failed to execute pasteHandler for ${type}, falling back to the next one.`);
            onError(e);
            continue;
        }
    }
}

/**
 * Clipboard paste handler that takes clipboard data given to us via an onPaste
 * handler, then handles it directly.
 */
export function usePasteHandler(opts: IPasteHandlerOpts) {

    const { onPasteImage, onPasteBlocks, onPasteError, onPasteText, id } = opts;
    const uploadHandler = useUploadHandler();

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
                    const uploadedFile = await uploadHandler({ file, target: { id, pos: 'bottom' } });

                    if (uploadedFile) {
                        onPasteImage(uploadedFile);
                    }
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

        async function extractPolarBlocks() {
            const blocksStructureItem = getPasteItem(pasteItems, 'polarblocks');

            if (blocksStructureItem) {
                const getJSONString = (): Promise<string> => new Promise((resolve) => (
                    blocksStructureItem.dataTransferItem.getAsString(resolve)
                ));

                try {
                    const blocks = JSON.parse(await getJSONString());

                    onPasteBlocks(blocks);

                } catch (e) {
                    console.error('Error: failed to parse application/polarblocks+json', e);
                }
            }
        }

        async function extractText() {
            const pasteItem = getPasteItem(pasteItems, 'text');

            if (pasteItem) {
                const getString = (): Promise<string> => new Promise((resolve) => (
                    pasteItem.dataTransferItem.getAsString(resolve)
                ));

                onPasteText(await getString());
            }
        }

        const canBeHandled = pasteItems
            .some(item => ~['html', 'image', 'polarblocks', 'text'].indexOf(item.kind));

        if (canBeHandled) {
            event.preventDefault();
            executePasteHandlers(
                [
                    // The following array represents priority
                    {type: 'polarblocks', handler: extractPolarBlocks},
                    {type: 'image', handler: extractImage},
                    {type: 'html', handler: extractHTML},
                    {type: 'text', handler: extractText},
                ],
                onPasteError,
            ).catch(e => console.log(e));
        }

    }, [uploadHandler, id, onPasteImage, onPasteBlocks, onPasteText, onPasteError])

}
