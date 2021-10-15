import {Devices} from 'polar-shared/src/util/Devices';
import React from 'react';
import {useHistory, useLocation} from "react-router-dom";

export const useContextMenuHook = (handleClose: () => void) => {

    const history = useHistory();
    const location = useLocation();

    const ref = React.useRef(false);
    const hash = React.useMemo(() => `#contextmenu${Date.now()}`, []);

    React.useEffect(()=>{
        // insert hash to url when opening the context menu
        if (!Devices.isDesktop()) {
            history.push({hash})
        }
    },[hash, history]);

    React.useEffect(() => {
        if (location.hash === hash && !ref.current) {
            ref.current = true;
        }
        if (location.hash !== hash && ref.current && !Devices.isDesktop()){
            handleClose();
        }
    }, [location.hash, hash, handleClose]);

    const handleCloseWithGoBack = React.useCallback(() => {
        handleClose();
        history.goBack();
    }, [handleClose, history])

    return Devices.isDesktop()? handleClose : handleCloseWithGoBack;
}
