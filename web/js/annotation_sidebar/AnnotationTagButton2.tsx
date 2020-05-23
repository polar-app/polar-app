import * as React from "react";
import IconButton from "@material-ui/core/IconButton";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import isEqual from "react-fast-compare";
import {IDocAnnotationRef} from "./DocAnnotation";
import {useAnnotationMutationsContext} from "./AnnotationMutationsContext";
import {useDocMetaContext} from "./DocMetaContextProvider";

interface IProps {
    readonly annotation: IDocAnnotationRef;
}

export const AnnotationTagButton2 = React.memo((props: IProps) => {

    const {doc} = useDocMetaContext();
    const annotationMutations = useAnnotationMutationsContext();

    const taggedCallback = annotationMutations.createTaggedCallback({selected: [props.annotation]});

    return (
        <IconButton disabled={! doc?.mutable}
                    size="small"
                    onClick={taggedCallback}>

            <LocalOfferIcon/>

        </IconButton>
    );
}, isEqual);
