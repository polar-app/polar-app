import React from "react";
import {deepMemo} from "../react/ReactUtils";
import {KeySequence} from "./KeySequence";
import {MUIButtonBar} from "../mui/MUIButtonBar";
import {KeyBinding} from "../keyboard_shortcuts/KeyboardShortcutsStore";

interface IProps {
    readonly sequences: ReadonlyArray<KeyBinding>;
}

export const KeySequences = deepMemo(function KeySequences(props: IProps) {

    return (
        <MUIButtonBar>
            {props.sequences.map(current => <KeySequence key={current.keys} sequence={current}/>)}
        </MUIButtonBar>
    );

});
