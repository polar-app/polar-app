import {useHistory} from "react-router-dom";
import * as React from "react";
import InfoIcon from '@material-ui/icons/Info';
import {FullWidthButton} from "./FullWidthButton";
import {RoutePathNames} from "../../../../../web/js/apps/repository/RoutePathNames";

export const ViewDeviceInfoButton = () => {

    const history = useHistory();

    return (
        <FullWidthButton onClick={() => history.push(RoutePathNames.DEVICE_INFO)} icon={<InfoIcon />}>
            Device Info
        </FullWidthButton>
    );

}
