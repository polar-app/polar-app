import CheckIcon from '@material-ui/icons/Check';
import React from "react";
import IconButton from "@material-ui/core/IconButton";
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import FlagIcon from '@material-ui/icons/Flag';
import MoreVertIcon from '@material-ui/icons/MoreVert';

export const DocButtons = React.memo(() => (

    <div style={{
            display: 'flex',
            justifyContent: 'flex-end'
         }}>

        <IconButton size="small">
            <LocalOfferIcon/>
        </IconButton>

        <IconButton size="small">
            <CheckIcon/>
        </IconButton>

        <IconButton size="small">
            <FlagIcon/>
        </IconButton>

        <IconButton size="small">
            <MoreVertIcon/>
        </IconButton>

    </div>

));

export const DocButtonsDemo = () => (
    <DocButtons/>
);

