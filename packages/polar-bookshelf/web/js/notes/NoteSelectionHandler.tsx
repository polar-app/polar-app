import * as React from 'react';
import { observer } from "mobx-react-lite"
import { useBlocksStore } from './store/BlocksStore';

interface IProps {
    readonly children: JSX.Element;
    readonly style?: React.CSSProperties;
}

export const NoteSelectionHandler = observer(function NoteSelectionHandler(props: IProps) {

    const blocksStore = useBlocksStore();

    const selected = blocksStore.selected();

    const handleDelete = React.useCallback((): boolean => {

        const deletable = Object.keys(selected);

        if (deletable.length > 0) {
            blocksStore.deleteBlocks(deletable);
            return true;
        }

        return false;

    }, [selected, blocksStore]);

    const onKeyDown = React.useCallback((event: React.KeyboardEvent) => {

        switch (event.key) {

            case 'Backspace':
            case 'Delete':

                if (handleDelete()) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                break;

            case 'ArrowUp':
            case 'ArrowDown':
            case 'Control':
            case 'Meta':
            case 'Command':
            case 'Shift':
                break;

            default:
                blocksStore.clearSelected("NoteSelectionHandler: other char");
                break;

        }

    }, [handleDelete, blocksStore]);

    return (
        <div style={props.style} onKeyDown={onKeyDown}>
            {props.children}
        </div>
    );

});
