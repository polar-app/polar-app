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
import {Button} from "@material-ui/core";
import {JSONRPC} from "../../../../../web/js/datastore/sharing/rpc/JSONRPC";

const AnkiExportDialog: React.FC = () => {
    const [ankiDeckUrl, setAnkiDeckUrl] = React.useState<string | undefined>(undefined);

    // @TODO Remove when backend code below starts working
    setTimeout((): void => {
        // Emulate a slow RPC call
        setAnkiDeckUrl('https://example.com');
    }, 1000);

    // TODO: Uncomment when backend is working
    // JSONRPC.exec<unknown, {
    //     temporary_url: string,
    // }>('FlashcardsExportFunction', {}).then((response) => {
    //     setAnkiDeckUrl(response.temporary_url);
    // });

    if (!ankiDeckUrl) {
        return <>
            <p>
                Your Anki deck is being prepared...
            </p>
        </>;
    }
    return <>
        <p>Your Anki deck is now ready.</p>
        <div>
            <Button
                variant="contained"
                color="primary"
                href={ankiDeckUrl}>
                Download .apkg file
            </Button>
        </div>
    </>
};

export const BlocksExportDropdown: React.FC = () => {
    const blocksAnnotationRepoStore = useBlocksAnnotationRepoStore();
    const blocksStore = useBlocksStore();
    const dialogManager = useDialogManager();

    const exportFlashcards = React.useCallback(() => {
        dialogManager.confirm({
            type: 'primary',
            title: 'Anki deck export',
            subtitle: <AnkiExportDialog/>,
            onAccept(): void {
            },
            noCancel: true,
            noAccept: true,
        });
    }, [dialogManager]);

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

                    <MUIMenuItem text="Download flashcards as an Anki deck"
                                 onClick={exportFlashcards}/>
                </div>

            </MUIMenu>
        </div>
    );

};

