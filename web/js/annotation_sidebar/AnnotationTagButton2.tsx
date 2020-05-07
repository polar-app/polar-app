import * as React from "react";
import IconButton from "@material-ui/core/IconButton";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import isEqual from "react-fast-compare";
import {IDocAnnotation} from "./DocAnnotation";
import {useAnnotationMutationsContext} from "./AnnotationMutationsContext";
import {useDocMetaContext} from "./DocMetaContextProvider";

interface IProps {
    readonly annotation: IDocAnnotation;
}

export const AnnotationTagButton2 = React.memo((props: IProps) => {

    const docMetaContext = useDocMetaContext();
    const annotationMutations = useAnnotationMutationsContext();

    const taggedCallback = annotationMutations.createTaggedCallback({selected: [props.annotation]});

    return (
        <IconButton disabled={! docMetaContext.mutable}
                    size="small"
                    onClick={taggedCallback}>

            <LocalOfferIcon/>

        </IconButton>
    );
}, isEqual);
