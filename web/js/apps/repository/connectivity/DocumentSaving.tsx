import React from 'react';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';


export const DocumentSaving = React.memo(() => {
    return (
        <Tooltip title="Document being saved to the cloud and will be written upon reconnect.">
            <Icon>
                <CloudUploadIcon/>
            </Icon>
        </Tooltip>
    );
});
