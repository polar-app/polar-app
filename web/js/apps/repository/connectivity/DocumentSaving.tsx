import React from 'react';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';
import useTheme from '@material-ui/core/styles/useTheme';

export const DocumentSaving = React.memo(() => {
    const theme = useTheme();
    return (
        <Tooltip title="Document being saved to the cloud and will be written upon reconnect.">
            <Icon style={{color: theme.palette.text.secondary}}>
                <CloudUploadIcon/>
            </Icon>
        </Tooltip>
    );
});
