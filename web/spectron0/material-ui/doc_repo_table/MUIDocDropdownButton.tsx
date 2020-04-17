import Button from "@material-ui/core/Button";
import React from "react";
import {MUIDocDropdownMenu} from "./MUIDocDropdownMenu";
import IconButton from "@material-ui/core/IconButton";
import grey from "@material-ui/core/colors/grey";
import MoreVertIcon from "@material-ui/icons/MoreVert";

export const MUIDocDropdownButton = React.forwardRef(() => {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>

            <IconButton
                aria-controls="doc-dropdown-menu"
                aria-haspopup="true"
                // variant="contained"
                color="default"
                onClick={handleClick}
                size="small"
                style={{color: grey[500]}}
            >
                <MoreVertIcon/>
            </IconButton>
        {anchorEl &&
            <MUIDocDropdownMenu anchorEl={anchorEl}
                                onClose={() => handleClose()}/>
        }
        </div>
    );

});
