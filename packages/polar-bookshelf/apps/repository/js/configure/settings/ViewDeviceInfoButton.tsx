import {useHistory} from "react-router-dom";
import * as React from "react";
import InfoIcon from '@material-ui/icons/Info';
import {RoutePathNames} from "../../../../../web/js/apps/repository/RoutePathNames";
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

export const ViewDeviceInfoButton = () => {

    const history = useHistory();

    return (
        <ListItem button onClick={() => history.push(RoutePathNames.DEVICE_INFO)}>
            <ListItemIcon>
            <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="Device Info" />
        </ListItem> 
    );

}
