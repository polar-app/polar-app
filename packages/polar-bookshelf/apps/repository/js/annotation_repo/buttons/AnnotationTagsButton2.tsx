import * as React from 'react';
import IconButton from "@material-ui/core/IconButton";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import isEqual from "react-fast-compare";

interface IProps {
    readonly onTagged: () => void;
}

export const AnnotationTagsButton2 = React.memo((props: IProps) => {

    return (
        <IconButton onClick={props.onTagged}>
            <LocalOfferIcon/>
        </IconButton>
    );

}, isEqual);
