import React from "react";
import {MiddleDot} from "./MiddleDot";
import {useNoteLinkLoader} from "./NoteLinkLoader";
import IconButton from "@material-ui/core/IconButton";

interface IProps {
    readonly target: string;
}

export const NoteBullet = (props: IProps) => {

    const noteLinkLoader = useNoteLinkLoader();

    return (
        <IconButton onClick={() => noteLinkLoader(props.target)}
                    size="small">
            <MiddleDot/>
        </IconButton>
    )
}

NoteBullet.displayName='NoteBullet';