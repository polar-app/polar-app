import React from "react";
import GetAppIcon from '@material-ui/icons/GetApp';
import {MUIMenu} from "../../../../../web/js/mui/menu/MUIMenu";
import {IconWithColor} from "../../../../../web/js/ui/IconWithColor";
import {MUIMenuItem} from "../../../../../web/js/mui/menu/MUIMenuItem";
import {useBlocksAnnotationRepoStore} from "../BlocksAnnotationRepoStore";
import {BlocksExportFormat} from "../../../../../web/js/metadata/blocks-exporter/IBlocksFormatExporter";
import {BlocksExporter} from "../../../../../web/js/metadata/blocks-exporter/BlocksExporter";
import {useBlocksStore} from "../../../../../web/js/notes/store/BlocksStore";

export const BlocksExportDropdown: React.FC = () => {
    const blocksAnnotationRepoStore = useBlocksAnnotationRepoStore();
    const blocksStore = useBlocksStore();

    const handleExport = React.useCallback((format: BlocksExportFormat) => () => {
        const ids = blocksAnnotationRepoStore.view.map(({ id }) => id);

        BlocksExporter.exportAsFile(blocksStore, format, ids).catch(console.error);
    }, [blocksAnnotationRepoStore, blocksStore]);

    return (
        <div>
            <MUIMenu caret
                     placement="bottom-end"
                     button={{ icon: <IconWithColor color="text.secondary" Component={GetAppIcon} /> }}>

                <div>
                    <MUIMenuItem text="Download as Markdown"
                                 onClick={handleExport(BlocksExportFormat.MARKDOWN)}/>

                    <MUIMenuItem text="Download as JSON"
                                 onClick={handleExport(BlocksExportFormat.JSON)}/>
                </div>

            </MUIMenu>
        </div>
    );

};
