import * as React from "react";
import IconButton from "@material-ui/core/IconButton";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import isEqual from "react-fast-compare";
import {IDocAnnotation} from "./DocAnnotation";
import {useAnnotationMutationCallbacks} from "./AnnotationMutationContext";

interface IProps {
    readonly annotation: IDocAnnotation;
    readonly mutable: boolean;
}

export const AnnotationTagButton2 = React.memo((props: IProps) => {

    const annotationMutationCallbacks = useAnnotationMutationCallbacks();

    return (
        <IconButton disabled={! props.mutable}
                    size="small"
                    onClick={() => annotationMutationCallbacks.onTagged(props.annotation)}>

            <LocalOfferIcon/>

        </IconButton>
    );
}, isEqual);
