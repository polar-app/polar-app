import {useHistory} from "react-router-dom";
import * as React from "react";
import InfoIcon from '@material-ui/icons/Info';
import {FullWidthButton} from "./FullWidthButton";
import {RoutePathnames} from "../../../../../web/js/apps/repository/RoutePathnames";

export const ViewDeviceInfoButton = () => {

    const history = useHistory();

    return (
        <FullWidthButton onClick={() => history.push(RoutePathnames.DEVICE_INFO)} icon={<InfoIcon />}>
            Device Info
        </FullWidthButton>
    );

}
