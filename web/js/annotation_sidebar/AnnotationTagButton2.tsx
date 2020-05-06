import * as React from "react";
import IconButton from "@material-ui/core/IconButton";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import isEqual from "react-fast-compare";
import {IDocAnnotation} from "./DocAnnotation";
import {useAnnotationMutationCallbacks} from "./AnnotationMutationsContext";
import {useDocMetaContext} from "./DocMetaContextProvider";

interface IProps {
    readonly annotation: IDocAnnotation;
}

export const AnnotationTagButton2 = React.memo((props: IProps) => {

    const docMetaContext = useDocMetaContext();
    const annotationMutationCallbacks = useAnnotationMutationCallbacks();

    return (
        <IconButton disabled={! docMetaContext.mutable}
                    size="small"
                    onClick={() => annotationMutationCallbacks.onTagged(props.annotation)}>

            <LocalOfferIcon/>

        </IconButton>
    );
}, isEqual);
