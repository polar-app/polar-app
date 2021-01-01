import * as React from "react";
import {Link} from "react-router-dom";
import {IconWithColor} from "../ui/IconWithColor";
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from "@material-ui/core/IconButton";

export const SettingsButton = React.memo(() => {

    return (
        <Link to="/settings">
            <IconButton>
                <IconWithColor color="text.secondary" Component={SettingsIcon}/>
            </IconButton>
        </Link>
    );

});

