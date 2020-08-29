import React from "react";
import { ButtonProps } from "./StandardToggleButton";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import {StandardButton} from "./StandardButton";

export const MUIDocTagButton = React.memo((props: ButtonProps) => (
    <StandardButton tooltip="Tag" {...props}>
        <LocalOfferIcon/>
    </StandardButton>
));
