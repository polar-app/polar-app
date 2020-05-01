import React from 'react';
import {library} from '@fortawesome/fontawesome-svg-core'
import {faCheckSquare, faCoffee, faTag} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import DeleteIcon from "@material-ui/icons/Delete";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import {SvgIcon, SvgIconProps} from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import isEqual from "react-fast-compare";
import {faSquare} from "@fortawesome/free-regular-svg-icons";

library.add(faCheckSquare, faCoffee, faTag, faCheckSquare, faSquare);

export const IconsDemo = () => (
    <div>
        <SvgIcon>
            <FontAwesomeIcon icon="coffee" />
        </SvgIcon>

        <IconButton>
            <SvgIcon>
                <FontAwesomeIcon icon="tag" />
            </SvgIcon>
        </IconButton>

        <IconButton>
            <LocalOfferIcon color="primary"/>
        </IconButton>

        <IconButton>
            <DeleteIcon />
        </IconButton>
    </div>
);

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
