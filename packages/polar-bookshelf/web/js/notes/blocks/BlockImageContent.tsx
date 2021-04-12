import React from "react";
import {IImageContent} from "../content/IImageContent";

interface IProps extends IImageContent {

}

export const BlockImageContent = (props: IProps) => {
    return (
        <img src={props.src} width={props.width} height={props.height} alt="Image block"/>
    )

}
