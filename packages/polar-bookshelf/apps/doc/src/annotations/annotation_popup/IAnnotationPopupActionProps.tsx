import React from "react";
import {IBlockAnnotation, IDocMetaAnnotation} from "./AnnotationPopupReducer";

export type IAnnotationPopupActionProps = {
    readonly className?: string,
    readonly style?: React.CSSProperties,
    readonly annotation: IDocMetaAnnotation | IBlockAnnotation,
};
