import React from "react";
import { ButtonProps } from "./StandardToggleButton";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import {StandardIconButton} from "./StandardIconButton";

export const MUIDocTagButton = React.memo((props: ButtonProps) => (
    <StandardIconButton tooltip="Tag" {...props}>
        <LocalOfferIcon/>
    </StandardIconButton>
));
