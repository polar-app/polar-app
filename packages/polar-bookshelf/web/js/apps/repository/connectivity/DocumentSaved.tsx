import React from 'react';
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';
import useTheme from '@material-ui/core/styles/useTheme';
import {MUITooltip} from "../../../mui/MUITooltip";

export const DocumentSaved = React.memo(() => {
    const theme = useTheme();
    return (
        <MUITooltip title="Document fully written to the the cloud..">
            <Icon style={{color: theme.palette.text.secondary}}>
                <CloudDoneIcon/>
            </Icon>
        </MUITooltip>
    );
});
