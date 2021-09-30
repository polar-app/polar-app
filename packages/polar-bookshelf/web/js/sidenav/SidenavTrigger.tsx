import {IconButton} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import {Devices} from "polar-shared/src/util/Devices";
import React from "react";
import { useHistory } from "react-router-dom";
import {useSideNavCallbacks, useSideNavStore} from "./SideNavStore";

export const SidenavTrigger: React.FC = () => {
    const {setOpen} = useSideNavCallbacks();
    const {isOpen} = useSideNavStore(['isOpen']);
    const history = useHistory();

    const handleToggle = (url: string) => {
        setOpen(!isOpen);
        history.replace(url);
    };
            
    React.useEffect(()=>{
        return history.listen((location) => {
            // if we press the back button
            if (history.action === 'POP' && history.location.pathname !== '/') {
                handleToggle('/');
            
                //if we try to open the sidenave not from the homepage
                if (history.location.pathname !== '/' ){
                    history.push('/');// not working yet!
                    handleToggle(`#sidenav${Date.now()}`)
                }
            }
        })
    },[history]);

    if (Devices.isDesktop()) {
        return null;
    }

    return (
        <IconButton onClick={ () => handleToggle(`#sidenav${Date.now()}`)}>
            <MenuIcon/>
        </IconButton>
    );
};
