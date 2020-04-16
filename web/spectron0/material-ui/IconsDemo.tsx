import React from 'react';
import {library} from '@fortawesome/fontawesome-svg-core'
import {faCheckSquare, faCoffee, faTag} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import DeleteIcon from "@material-ui/icons/Delete";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import {SvgIcon} from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';

library.add(faCheckSquare, faCoffee, faTag);

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
