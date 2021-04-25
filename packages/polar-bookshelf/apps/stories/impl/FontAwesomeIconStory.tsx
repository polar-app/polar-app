import * as React from 'react';
import {FADiscordIcon, FATagIcon} from "../../../web/js/mui/MUIFontAwesome";
import IconButton from '@material-ui/core/IconButton';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';

export const FontAwesomeIconStory = () => {

    return (
        <div>

            <IconButton>
                <FADiscordIcon/>
            </IconButton>

            <IconButton>
                <FATagIcon/>
            </IconButton>

            <IconButton>
                <AcUnitIcon/>
            </IconButton>

            <IconButton>
                <AccountBalanceIcon/>
            </IconButton>

        </div>
    );

};
