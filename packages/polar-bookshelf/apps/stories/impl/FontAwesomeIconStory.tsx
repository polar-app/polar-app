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

                <svg>
                    <path d="M144 32H32A32 32 0 0 0 0 64v384a32 32 0 0 0 32 32h112a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H64V96h80a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zm272 0H304a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h80v320h-80a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h112a32 32 0 0 0 32-32V64a32 32 0 0 0-32-32z"/>
                </svg>

            </>
        </StoryHolder>
    );

};
