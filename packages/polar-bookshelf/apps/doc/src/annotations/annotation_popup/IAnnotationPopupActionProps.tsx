import React from "react";
import {IBlockAnnotation} from "./AnnotationPopupReducer";

export type IAnnotationPopupActionProps = {
    readonly className?: string,
    readonly style?: React.CSSProperties,
    readonly annotation: IBlockAnnotation,
};
