import React from "react";
import {MiddleDot} from "./MiddleDot";
import {NoteTargetStr, useNoteLinkLoader} from "./NoteLinkLoader";
import {NoteButton} from "./NoteButton";
import {NoteIDStr, useNotesStore} from "./store/NotesStore";
import { observer } from "mobx-react-lite"
import { NoteLink } from "./NoteLink";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import useTheme from "@material-ui/core/styles/useTheme";


interface IProps {
    readonly target: NoteIDStr | NoteTargetStr;
}

export const NoteBulletButton = observer(function NoteBulletButton(props: IProps) {

    const theme = useTheme();
    const store = useNotesStore();

    const disabled = store.root === props.target;

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

