import * as React from 'react';
import {MUITooltip} from "../../../web/js/mui/MUITooltip";
import FlagIcon from "@material-ui/icons/Flag";
import ArchiveIcon from "@material-ui/icons/Archive";
import IconButton from '@material-ui/core/IconButton';

export const MUITooltipStory = () => {
    return (
        <div>
            <MUITooltip title="Flag">
                <IconButton>
                    <FlagIcon/>
                </IconButton>
            </MUITooltip>
            <MUITooltip title="Archive">
                <IconButton>
                    <ArchiveIcon/>
                </IconButton>
            </MUITooltip>
        </div>
    );
}