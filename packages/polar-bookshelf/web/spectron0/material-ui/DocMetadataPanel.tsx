import React from 'react';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";

interface IProps extends IDocInfo {

}

export const DocMetaPanel = () => {
    return (
        <Paper square elevation={0}>

            <Typography>

            </Typography>

        </Paper>
    )
}
