import * as React from 'react';
import {SideType} from "./DockLayoutManager";
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from "@material-ui/core/IconButton";
import {useDockLayoutCallbacks} from "./DockLayoutStore";
import {MUITooltip} from "../../mui/MUITooltip";

interface IProps {
    readonly side: SideType;
}

export const DockLayoutToggleButton = React.memo((props: IProps) => {

    const {toggleSide} = useDockLayoutCallbacks();

    const handleToggle = React.useCallback(() => {
        toggleSide(props.side);
    }, [props.side, toggleSide])

    return (
        <MUITooltip title={`Toggle ${props.side} sidebar`}>
            <IconButton onClick={handleToggle}>
                <MenuIcon/>
            </IconButton>
        </MUITooltip>
    );

})