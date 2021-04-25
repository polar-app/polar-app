import React from "react";
import {deepMemo} from "../react/ReactUtils";
import { KeySequence } from "./KeySequence";
import {MUIButtonBar} from "../mui/MUIButtonBar";

interface IProps {
    readonly sequences: ReadonlyArray<string>;
}

export const KeySequences = deepMemo(function KeySequences(props: IProps) {

    return (
        <MUIButtonBar>
            {props.sequences.map(current => <KeySequence key={current} sequence={current}/>)}
        </MUIButtonBar>
    );

});
