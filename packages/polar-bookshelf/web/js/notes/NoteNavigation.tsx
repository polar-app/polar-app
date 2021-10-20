import * as React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import {observer} from "mobx-react-lite"
import {useBlocksTreeStore} from './BlocksTree';
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";

interface IProps {
    readonly parent: BlockIDStr | undefined;
    readonly id: BlockIDStr;
    readonly children: JSX.Element;
}

export const NoteNavigation = observer(function NoteNavigation(props: IProps) {

    const blocksTreeStore = useBlocksTreeStore();

    const [ref, setRef] = React.useState<HTMLDivElement | null>(null);

    const handleClickAway = React.useCallback(() => {
        // noop for now
    }, []);


    const handleClick = React.useCallback(() => {
        blocksTreeStore.setActiveWithPosition(props.id, undefined);
    }, [props.id, blocksTreeStore]);

    return (
        <>
            <ClickAwayListener onClickAway={handleClickAway}>
                <div style={{flexGrow: 1}}
                     ref={setRef}
                     onClick={handleClick}>

                    {ref !== null && props.children}

                </div>
            </ClickAwayListener>
        </>
    );

});
