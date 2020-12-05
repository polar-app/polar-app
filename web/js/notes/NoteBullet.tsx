import React from "react";
import {MiddleDot} from "./MiddleDot";
import {NoteTargetStr, useNoteLinkLoader} from "./NoteLinkLoader";
import {deepMemo} from "../react/ReactUtils";
import {NoteButton} from "./NoteButton";

interface IProps {
    readonly target: NoteTargetStr;
}

export const NoteBullet = deepMemo(function NoteBullet(props: IProps) {

    const noteLinkLoader = useNoteLinkLoader();

    return (
        <NoteButton onClick={() => noteLinkLoader(props.target)}>
            <MiddleDot/>
        </NoteButton>
    );
})

