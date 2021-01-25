import React from "react";
import {MiddleDot} from "./MiddleDot";
import {NoteTargetStr, useNoteLinkLoader} from "./NoteLinkLoader";
import {NoteButton} from "./NoteButton";
import {NoteIDStr, useNotesStore} from "./store/NotesStore";
import { observer } from "mobx-react-lite"
import { NoteLink } from "./NoteLink";

interface IProps {
    readonly target: NoteIDStr | NoteTargetStr;
}

export const NoteBulletButton = observer(function NoteBulletButton(props: IProps) {

    const noteLinkLoader = useNoteLinkLoader();
    const store = useNotesStore();

    const disabled = store.root === props.target;

    return (
        // <NoteLink target={props.target}>
            <NoteButton onClick={() => noteLinkLoader(props.target)}
                        disabled={disabled}>
                <MiddleDot/>
            </NoteButton>
        // </NoteLink>
    );
})

