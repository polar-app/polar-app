import React from "react";
import {SvgIcon, SvgIconProps} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCheckSquare,
    faCoffee,
    faTag
} from "@fortawesome/free-solid-svg-icons";
import isEqual from "react-fast-compare";
import {faSquare} from "@fortawesome/free-regular-svg-icons";
import {library} from "@fortawesome/fontawesome-svg-core";

library.add(faCheckSquare, faCoffee, faTag, faCheckSquare, faSquare);

export const FACheckSquare = React.memo((props: SvgIconProps) => (
    <SvgIcon {...props}>
        <FontAwesomeIcon icon={faCheckSquare} />
    </SvgIcon>

), isEqual);

export const FASquare = React.memo((props: SvgIconProps) => (
    <SvgIcon {...props}>
        <FontAwesomeIcon icon={faSquare} />
    </SvgIcon>

), isEqual);
