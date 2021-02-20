import {NoteIDStr, useNotesStore} from "./store/NotesStore";
import * as React from "react";
import { observer } from "mobx-react-lite"

interface IProps {
    readonly id: NoteIDStr;
}

export const NoteActivation = observer(function NoteActivation(props: IProps) {

    const {id} = props

    return null;

});
