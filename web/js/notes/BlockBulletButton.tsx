import React from "react";
import {MiddleDot} from "./MiddleDot";
import {BlockTargetStr, useNoteLinkLoader} from "./NoteLinkLoader";
import {NoteButton} from "./NoteButton";
import {BlockIDStr, useBlocksStore} from "./store/BlocksStore";
import { observer } from "mobx-react-lite"
import { NoteLink } from "./NoteLink";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import useTheme from "@material-ui/core/styles/useTheme";


interface IProps {
    readonly target: BlockIDStr | BlockTargetStr;
}

export const BlockBulletButton = observer(function NoteBulletButton(props: IProps) {

    const theme = useTheme();
    const blocksStore = useBlocksStore();

    const disabled = blocksStore.root === props.target;

    // ev.dataTransfer.setData("text/plain", ev.target.id);

    return (
        <NoteLink target={props.target}
                  style={{color: theme.palette.text.hint}}
                  draggable={true}>
            <NoteButton onClick={NULL_FUNCTION}
                        disabled={disabled}>
                <MiddleDot/>
            </NoteButton>
        </NoteLink>
    );
})

