import React from "react";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {useBlocksStore} from "./store/BlocksStore";
import {useDialogManager} from "../mui/dialogs/MUIDialogControllers";

interface IProps {
    readonly id: BlockIDStr;
}

export const BlockDebug: React.FC<IProps> = (props) => {
    const { id } = props;
    const blocksStore = useBlocksStore();
    const dialogManager = useDialogManager();

    const onDumpBlock = React.useCallback(() => {
        const block = blocksStore.getBlock(id);

        if (! block) {
            dialogManager.snackbar({
                type: 'error',
                message: `Block with the id "${id}" was not found`,
            });
            return;
        }

        dialogManager.dialog({
            title: `${id} block data dump`,
            body: <pre>{ JSON.stringify(block.toJSON(), null, 4) }</pre>,
            onAccept: () => null,
        });
    }, [blocksStore, id, dialogManager]);

    return (
        <div style={{ position: 'relative', zIndex: 1000 }}>
            <div style={{
                position: 'absolute',
                color: 'red',
                fontSize: "12px",
                top: -12,
            }}>
                {id}
                &nbsp;&nbsp;
                <span onClick={onDumpBlock} style={{ color: 'cyan', cursor: 'pointer' }}>Dump block</span>
            </div>
        </div>
    );
};
