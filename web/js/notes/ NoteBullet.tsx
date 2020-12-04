import React from "react";
import {MiddleDot} from "./MiddleDot";
import {NoteTargetStr, useNoteLinkLoader} from "./NoteLinkLoader";
import IconButton from "@material-ui/core/IconButton";
import {deepMemo} from "../react/ReactUtils";

interface IProps {
    readonly target: NoteTargetStr;
}

export const NoteBullet = deepMemo(function NoteBullet(props: IProps) {

    const noteLinkLoader = useNoteLinkLoader();

    return (
        <IconButton onClick={() => noteLinkLoader(props.target)}
                    size="small">
            <MiddleDot/>
        </IconButton>
    );
})

