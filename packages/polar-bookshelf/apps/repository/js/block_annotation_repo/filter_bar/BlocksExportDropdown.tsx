import React from "react";
import GetAppIcon from '@material-ui/icons/GetApp';
import {MUIMenu} from "../../../../../web/js/mui/menu/MUIMenu";
import {IconWithColor} from "../../../../../web/js/ui/IconWithColor";
import {MUIMenuItem} from "../../../../../web/js/mui/menu/MUIMenuItem";
import {useBlocksAnnotationRepoStore} from "../BlocksAnnotationRepoStore";
import {BlocksExportFormat} from "../../../../../web/js/metadata/blocks-exporter/IBlocksFormatExporter";
import {BlocksExporter} from "../../../../../web/js/metadata/blocks-exporter/BlocksExporter";
import {useBlocksStore} from "../../../../../web/js/notes/store/BlocksStore";
import {useDialogManager} from "../../../../../web/js/mui/dialogs/MUIDialogControllers";
import {FlashCardsExport} from "polar-backend-api/src/api/FlashCardsExport";
import {JSONRPC} from "../../../../../web/js/datastore/sharing/rpc/JSONRPC";
import {useErrorHandler} from "../../../../../web/js/mui/MUIErrorHandler";
import {FileSavers} from "polar-file-saver/src/FileSavers";
import {FeatureEnabled} from "../../../../../web/js/features/FeaturesRegistry";
import FlashcardExportRequest = FlashCardsExport.FlashcardExportRequest;
import FlashcardExportResponse = FlashCardsExport.FlashcardExportResponse;

function useAnkiDeckDownloadHandler() {

    const blocksAnnotationRepoStore = useBlocksAnnotationRepoStore();

    return React.useCallback(async () => {

        const identifiers = blocksAnnotationRepoStore.view.map(current => current.id);

        const request: FlashcardExportRequest = {
            blockIDs: identifiers,
            ankiDeckName: 'polar-anki-deck' + Date.now()
        }

        return await JSONRPC.exec<FlashcardExportRequest, FlashcardExportResponse>('FlashcardsExportFunction', request)

    }, [blocksAnnotationRepoStore])

}

export const BlocksExportDropdown: React.FC = () => {
    const blocksAnnotationRepoStore = useBlocksAnnotationRepoStore();
    const blocksStore = useBlocksStore();
    const dialogManager = useDialogManager();

    const errorHandler = useErrorHandler();
    const ankiDeckDownloadHandler = useAnkiDeckDownloadHandler();

    const handleExportFlashcards = React.useCallback(() => {

        async function doAsync() {

            const taskbar = await dialogManager.taskbar({
                message: "Preparing Anki deck for download..."
            });

            async function doDownload() {

                const response = await ankiDeckDownloadHandler();

                FileSavers.saveAs(response.temporary_url, 'polar-anki-deck' + Date.now());

            }

            try {

                await doDownload();

            } catch (e) {
                throw e;
            } finally {
                taskbar.destroy();
            }

        }

        doAsync().catch(err => errorHandler(err));

    }, [dialogManager, errorHandler, ankiDeckDownloadHandler]);

    const handleExport = React.useCallback((format: BlocksExportFormat) => () => {
        const ids = blocksAnnotationRepoStore.view.map(({id}) => id);

        BlocksExporter.exportAsFile(blocksStore, format, ids).catch(console.error);
    }, [blocksAnnotationRepoStore, blocksStore]);

    return (
        <div>
            <MUIMenu caret
                     placement="bottom-end"
                     button={{icon: <IconWithColor color="text.secondary" Component={GetAppIcon}/>}}>

                <div>
                    <MUIMenuItem text="Download as Markdown"
                                 onClick={handleExport(BlocksExportFormat.MARKDOWN)}/>

                    <MUIMenuItem text="Download as JSON"
                                 onClick={handleExport(BlocksExportFormat.JSON)}/>

                    <FeatureEnabled feature={['anki-deck-downloads']}>
                        <MUIMenuItem text="Download Flashcards as an Anki Deck"
                                     onClick={handleExportFlashcards}/>
                    </FeatureEnabled>

                </div>

            </MUIMenu>
        </div>
    );

};

