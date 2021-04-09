import * as React from "react";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import {IDocAnnotationRef} from "./DocAnnotation";
import {useAnnotationMutationsContext} from "./AnnotationMutationsContext";
import {useDocMetaContext} from "./DocMetaContextProvider";
import {deepMemo} from "../react/ReactUtils";
import {StandardIconButton} from "../../../apps/repository/js/doc_repo/buttons/StandardIconButton";

interface IProps {
    readonly annotation: IDocAnnotationRef;
}

export const AnnotationTagButton2 = deepMemo((props: IProps) => {

    const {doc} = useDocMetaContext();
    const annotationMutations = useAnnotationMutationsContext();

    const taggedCallback = annotationMutations.createTaggedCallback({selected: [props.annotation]});

    return (
        <StandardIconButton tooltip="Tag highlight"
                            disabled={! doc?.mutable}
                            size="small"
                            onClick={taggedCallback}>

            <LocalOfferIcon/>

        </StandardIconButton>
    );


});
