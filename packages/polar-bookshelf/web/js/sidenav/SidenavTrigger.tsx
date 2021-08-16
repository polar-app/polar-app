import {IconButton} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import {Devices} from "polar-shared/src/util/Devices";
import React from "react";
import {useSideNavCallbacks, useSideNavStore} from "./SideNavStore";

export const SidenavTrigger: React.FC = () => {
    const {setOpen} = useSideNavCallbacks();
    const {isOpen} = useSideNavStore(['isOpen']);
    const handleToggle = React.useCallback(() => setOpen(! isOpen), [setOpen, isOpen]);

    if (Devices.isDesktop()) {
        return null;
    }

    return (
        <IconButton onClick={handleToggle}>
            <MenuIcon/>
        </IconButton>
    );
};
