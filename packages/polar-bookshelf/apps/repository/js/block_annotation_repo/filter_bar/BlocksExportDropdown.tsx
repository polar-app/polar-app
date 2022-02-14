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
import {FlashcardsExport} from "polar-backend-api/src/api/FlashcardsExport";
import {JSONRPC} from "../../../../../web/js/datastore/sharing/rpc/JSONRPC";
import {useErrorHandler} from "../../../../../web/js/mui/MUIErrorHandler";
import {FileSavers} from "polar-file-saver/src/FileSavers";
import {Analytics, useAnalytics} from "../../../../../web/js/analytics/Analytics";
import FlashcardExportRequest = FlashcardsExport.FlashcardExportRequest;
import FlashcardExportResponse = FlashcardsExport.FlashcardExportResponse;
import {useAccountUpgrader} from "../../../../../web/js/ui/account_upgrade/AccountUpgrader";
import {Billing} from "polar-accounts/src/Billing";
import V2PlanFree = Billing.V2PlanFree;
import {useHistory} from "react-router-dom";
import {useFeatureEnabled} from "../../../../../web/js/features/FeaturesRegistry";

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
    const analytics = useAnalytics();

    const accountUpgrade = useAccountUpgrader();
    const history = useHistory();

    const isAnkiExportAPremiumFeature = useFeatureEnabled('premium-anki-export');

    const doExportFlashcards = React.useCallback(() => {

        async function doAsync() {

            const taskbar = await dialogManager.taskbar({
                message: "Preparing Anki deck for download..."
            });

            async function doDownload() {

                const response = await ankiDeckDownloadHandler();

                analytics.event2('anki-sync-flashcard-download');

                FileSavers.downloadURL(response.temporary_url, 'polar-anki-deck' + Date.now());

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

    }, [dialogManager, errorHandler, ankiDeckDownloadHandler, analytics]);

    const handleExportFlashcards = React.useCallback(() => {

        if (isAnkiExportAPremiumFeature && accountUpgrade?.plan === V2PlanFree) {
            Analytics.event2('account-upgrade-required', {
                reason: 'anki_export'
            });

            dialogManager.confirm({
                title: 'Account Upgraded Required',
                acceptText: "Upgrade Plan",
                type: 'primary',
                subtitle: 'Anki export is available in the Plus and Pro plan',
                onAccept: () => history.push('/plans')
            })
            return;
        }

        dialogManager.confirm({
            title: "Download your flashcards as an Anki deck",
            subtitle: "This will download selected flashcards as an Anki deck to your device.",
            type: 'info',
            acceptText: "OK",
            onAccept: doExportFlashcards
        });

    }, [dialogManager, doExportFlashcards, accountUpgrade, history, isAnkiExportAPremiumFeature]);

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

                    <MUIMenuItem text="Download Flashcards as an Anki Deck"
                                 onClick={handleExportFlashcards}/>

                </div>

            </MUIMenu>
        </div>
    );

};

