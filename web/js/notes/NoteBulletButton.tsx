import React from "react";
import {MiddleDot} from "./MiddleDot";
import {NoteTargetStr, useNoteLinkLoader} from "./NoteLinkLoader";
import {NoteButton} from "./NoteButton";
import {NoteIDStr, useNotesStore} from "./store/NotesStore2";
import { observer } from "mobx-react-lite"

interface IProps {
    readonly target: NoteIDStr | NoteTargetStr;
}

export const NoteBulletButton = observer(function NoteBulletButton(props: IProps) {

    const noteLinkLoader = useNoteLinkLoader();
    const store = useNotesStore();

    const disabled = store.root === props.target;

    return (
        <NoteButton onClick={() => noteLinkLoader(props.target)}
                    disabled={disabled}>
            <MiddleDot/>
        </NoteButton>
    );
})

