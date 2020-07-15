import React from 'react';
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';

export const DocumentSaved = React.memo(() => {
    return (
        <Tooltip title="Document being saved to the cloud...">
            <Icon>
                <CloudDoneIcon/>
            </Icon>
        </Tooltip>
    );
});
