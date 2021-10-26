import * as React from 'react';
import {FADiscordIcon, FATagIcon} from "../../../web/js/mui/MUIFontAwesome";
import IconButton from '@material-ui/core/IconButton';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import {StoryHolder} from "../StoryHolder";
import {MUIBracketSvgIcon} from "../../../web/js/mui/MUIBracketSvgIcon";

export const FontAwesomeIconStory = () => {

    return (
        <StoryHolder>
            <>
                <IconButton>
                    <FADiscordIcon/>
                </IconButton>

                <IconButton>
                    <FATagIcon/>
                </IconButton>

                <IconButton>
                    <AcUnitIcon/>
                </IconButton>

                bracket icon:

                <IconButton>
                    <MUIBracketSvgIcon/>
                </IconButton>

            </>
        </StoryHolder>
    );

};
