import {makeStyles} from "@material-ui/core";
import {createStyles} from "@material-ui/styles";
import {observer} from "mobx-react-lite";
import React from "react";
import {BlockEditorGenericProps} from "../BlockEditor";
import {useBlocksTreeStore} from "../BlocksTree";
import {hasModifiers} from "../contenteditable/BlockKeyboardHandlers";
import {DataURLStr} from "polar-blocks/src/blocks/content/IImageContent";

interface IProps extends BlockEditorGenericProps {
    readonly src: DataURLStr;

    readonly width: number;
    readonly height: number;
}

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            whiteSpace: 'pre-wrap',
            "& img": {
                boxSizing: 'content-box',
            }
        },
    }),
);


export const BlockImageContent = observer((props: IProps) => {
    const divRef = React.useRef<HTMLDivElement | null>(null);
    const {id, src, width, height, innerRef, onClick, onKeyDown} = props;
    const classes = useStyles();
    const blocksTreeStore = useBlocksTreeStore();

    const handleRef = React.useCallback((current: HTMLDivElement | null) => {

        divRef.current = current;

        if (innerRef) {
            innerRef.current = current;
        }

    }, [innerRef]);

    const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
        if ((e.key === 'Backspace' || e.key === 'Delete') && ! hasModifiers(e)) {
            blocksTreeStore.deleteBlocks([id]);
            e.preventDefault();
        } else if (onKeyDown) {
            onKeyDown(e);
        }
    }, [blocksTreeStore, id, onKeyDown]);

    React.useEffect(() => {
        const elem = divRef.current;
        if (!elem) {
            return;
        }

        const img = document.createElement('img');
        img.src = src;
        img.width = width;
        img.height = height;
        elem.innerHTML = '';
        elem.appendChild(img);
    }, [src, width, height]);

    return (
        <div onClick={onClick}
             onKeyDown={handleKeyDown}
             className={classes.root}
             contentEditable
             ref={handleRef} />
    );

});
