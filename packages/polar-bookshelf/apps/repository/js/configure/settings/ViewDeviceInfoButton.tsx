import {useHistory} from "react-router-dom";
import * as React from "react";
import Button from "@material-ui/core/Button";

export const ViewDeviceInfoButton = () => {

    const history = useHistory();

    return (
        <Button variant="contained"
                onClick={() => history.push("/device")}>
            View Device Info
        </Button>
    );

}
