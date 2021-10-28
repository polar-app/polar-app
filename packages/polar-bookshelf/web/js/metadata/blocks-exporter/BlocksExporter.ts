import {BlockIDStr, IBlockContentStructure} from "polar-blocks/src/blocks/IBlock";
import {FileSavers} from "polar-file-saver/src/FileSavers";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {IBlocksStore} from "../../notes/store/IBlocksStore";
import {BlobWriter} from "../exporter/writers/BlobWriter";
import {BlocksJSONExporter} from "./BlocksJSONExporter";
import {BlocksMarkdownExporter} from "./BlocksMarkdownExporter";
import {BlocksExportFormat, IBlocksFormatExporter} from "./IBlocksFormatExporter";

export namespace BlocksExporter {

    /**
     * Export a given set of block IDs as a browser file download
     *
     * @param blocksStore BlocksStore instance
     * @param format The requested export format
     * @param blockIDs The IDs of the blocks that'll be exported (Providing an empty value will cause all the blocks in the system to be exported)
     */
    export async function exportAsFile(blocksStore: IBlocksStore,
                                       format: BlocksExportFormat,
                                       blockIDs?: ReadonlyArray<BlockIDStr>): Promise<void> {
        
        const blockContentStructures = getStructuresToExport(blocksStore, blockIDs);

        const exporter = getExporter(format);

        const writer = new BlobWriter();

        await writer.write(exporter.toStringData(blockContentStructures));

        const blob = writer.toBlob(exporter.getMimeType());
        const ext = exporter.getFileExtension();

        const timestamp = ISODateTimeStrings.create();
        const filename = `blocks-${timestamp}.${ext}`;

        FileSavers.saveAs(blob, filename);

    }

    /**
     * Get the block exporter associated with a specific export format
     *
     * @param format The wanted format
     */
    function getExporter(format: BlocksExportFormat): IBlocksFormatExporter {

        switch (format) {
            case BlocksExportFormat.JSON:
                return new BlocksJSONExporter();
            case BlocksExportFormat.MARKDOWN:
                return new BlocksMarkdownExporter();
            default:
                const _: never = format;
                throw new Error('Unhandled export format');
        }

    }


    /**
     * Generate a block content structure array from an array of block IDs
     *
     * @param blocksStore BlocksStore instance
     * @param blockIDs The block IDs to generate the content structure for
     */
    function getStructuresToExport(blocksStore: IBlocksStore,
                                   blockIDs?: ReadonlyArray<BlockIDStr>): ReadonlyArray<IBlockContentStructure> {

        const blockIDsToExport = blockIDs || Object.values(blocksStore.indexByName);

        return blocksStore.createBlockContentStructure(blockIDsToExport);

    }
}
