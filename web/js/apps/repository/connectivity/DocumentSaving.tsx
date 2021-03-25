import React from 'react';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';
import useTheme from '@material-ui/core/styles/useTheme';
import {MUITooltip} from "../../../mui/MUITooltip";

export const DocumentSaving = React.memo(function DocumentSaving() {
    const theme = useTheme();
    return (
        <MUITooltip title="Document being saved to the cloud and will be written upon reconnect.">
            <Icon style={{color: theme.palette.text.secondary}}>
                <CloudUploadIcon/>
            </Icon>
        </MUITooltip>
    );
});
