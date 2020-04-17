import CheckIcon from '@material-ui/icons/Check';
import React from "react";
import IconButton from "@material-ui/core/IconButton";
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import FlagIcon from '@material-ui/icons/Flag';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import grey from "@material-ui/core/colors/grey";

export const DocButtons = React.memo(() => (

    <div style={{
            display: 'flex',
            justifyContent: 'flex-end'
         }}>

        <IconButton size="small"
                    style={{color: grey[500]}}>
            <LocalOfferIcon/>
        </IconButton>

        <IconButton size="small"
                    style={{color: grey[500]}}>
            <CheckIcon/>
        </IconButton>

        <IconButton size="small"
                    style={{color: grey[500]}}>
            <FlagIcon/>
        </IconButton>

        <IconButton size="small"
                    style={{color: grey[500]}}>
            <MoreVertIcon/>
        </IconButton>

    </div>

));

export const DocButtonsDemo = () => (
    <DocButtons/>
);

