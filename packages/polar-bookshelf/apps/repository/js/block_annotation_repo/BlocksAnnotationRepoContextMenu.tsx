import * as React from "react";
import {MUIMenuItem} from "../../../../web/js/mui/menu/MUIMenuItem";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import {useBlocksAnnotationRepoStore} from "./BlocksAnnotationRepoStore";
import {observer} from "mobx-react-lite";
import {useBlocksStore} from "../../../../web/js/notes/store/BlocksStore";
import {Sets} from "polar-shared/src/util/Sets";

export const BlocksAnnotationRepoTableMenu = observer(function BlocksAnnotationRepoTableMenu() {

    const blocksAnnotationRepoStore = useBlocksAnnotationRepoStore();
    const blocksStore = useBlocksStore();

    const handleDelete = React.useCallback(() => {
        const selected = blocksAnnotationRepoStore.selected;
        console.log("Performing delete on N annotations: ", selected.size)
        blocksStore.deleteBlocks(Sets.toArray(selected));
    }, [blocksAnnotationRepoStore.selected, blocksStore])

    return (
        <>
            {/*<MUIMenuItem text="Tag"*/}
            {/*    icon={<LocalOfferIcon/>} />*/}

            {/*<MUIMenuItem text="Copy"*/}
            {/*    icon={<FileCopyIcon/>} />*/}

            {/*<Divider/>*/}
            <MUIMenuItem text="Delete"
                         onClick={() => handleDelete()}
                         icon={<DeleteForeverIcon/>} />
        </>
    );

});
