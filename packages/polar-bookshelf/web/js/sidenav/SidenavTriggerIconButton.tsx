import {IconButton} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import {Devices} from "polar-shared/src/util/Devices";
import React from "react";
import {useHistory} from "react-router-dom";
import {useSideNavCallbacks, useSideNavStore} from "./SideNavStore";

interface IProps {
    readonly icon?: React.ReactNode;
}

export const SidenavTriggerIconButton = function SidenavTriggerIconButton(props: IProps) {

    // TODO: this could be cleaned up and made into a hook.

    const {setOpen} = useSideNavCallbacks();
    const {isOpen} = useSideNavStore(['isOpen']);
    const history = useHistory();

    const handleToggle = (url: string) => {
        setOpen(!isOpen);
        history.push(url);
    };

    React.useEffect(()=>{
        return history.listen((location) => {
            // if we press the back button
            if (history.action === 'POP') {
                setOpen(false)
            }

        })
    }, [history, setOpen]);

    if (Devices.isDesktop()) {
        return null;
    }

    return (
        <IconButton onClick={ () => handleToggle(`#sidenav${Date.now()}`)}>
            {props.icon ? props.icon : <MenuIcon/>}
        </IconButton>
    );

};
