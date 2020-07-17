import React from "react";
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';
import CloudOffIcon from '@material-ui/icons/CloudOff';

export const CloudOffline = React.memo(() => (
    <Tooltip title="You're currently offline and not connected to the cloud.">
        <Icon>
            <CloudOffIcon/>
        </Icon>
    </Tooltip>
));
