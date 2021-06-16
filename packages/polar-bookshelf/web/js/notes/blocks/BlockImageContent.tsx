import {makeStyles} from "@material-ui/core";
import {createStyles} from "@material-ui/styles";
import clsx from "clsx";
import {observer} from "mobx-react-lite";
import React from "react";
import {BlockEditorGenericProps} from "../BlockEditor";
import {DataURLStr} from "../content/IImageContent";
import {hasModifiers} from "../contenteditable/BlockKeyboardHandlers";
import {ContentEditables} from "../ContentEditables";
import {useBlocksStore} from "../store/BlocksStore";

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
    const blocksStore = useBlocksStore();

    const handleRef = React.useCallback((current: HTMLDivElement | null) => {

        divRef.current = current;

        if (innerRef) {
            innerRef.current = current;
        }

    }, [innerRef]);

    const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
        if ((e.key === 'Backspace' || e.key === 'Delete') && !hasModifiers(e)) {
            blocksStore.deleteBlocks([id]);
            e.preventDefault();
        } else if (onKeyDown) {
            onKeyDown(e);
        }
    }, [blocksStore, id, onKeyDown]);

    React.useEffect(() => {
        const elem = divRef.current;
        if (!elem) {
            return;
        }
        const getSpacer = () => {
            const span = document.createElement('span');
            span.style.display = 'inline-block';
            span.style.height = '100%';
            span.appendChild(document.createTextNode(' '));
            return span;
        };

        const img = document.createElement('img');
        img.src = src;
        img.width = width;
        img.height = height;
        elem.innerHTML = '';
        elem.appendChild(getSpacer());
        elem.appendChild(img);
        elem.appendChild(getSpacer());
    }, [src, width, height]);

    return (
        <div onClick={onClick}
             onKeyDown={handleKeyDown}
             className={classes.root}
             contentEditable
             ref={handleRef} />
    );

});
