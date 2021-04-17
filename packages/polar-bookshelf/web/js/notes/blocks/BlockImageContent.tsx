import React from "react";
import {DataURLStr} from "../content/IImageContent";

interface IProps {
    readonly src: DataURLStr;

    readonly width: number;
    readonly height: number;

}

export const BlockImageContent = (props: IProps) => {
    return (
        <img src={props.src} width={props.width} height={props.height} alt="Image block"/>
    )

}
