import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import React from "react";

export type IAnnotationPopupActionProps = {
    readonly className?: string,
    readonly style?: React.CSSProperties,
    readonly annotationID: BlockIDStr;
};
