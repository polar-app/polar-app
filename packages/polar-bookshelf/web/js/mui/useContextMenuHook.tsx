import React from 'react';
import {useHistory} from "react-router-dom";

export const useContextMenuHook = (handleClose: () => void) => {

    const history = useHistory();

    const handleCloseWithReplace = React.useCallback((event) => {
        if(event.keyCode === 27 || event.type=='popstate' ) {
            history.goBack();
            handleClose();
        }
    }, [history, handleClose]);
    
    React.useEffect(()=>{
        history.push({hash:`#prompt-${Date.now()}`})
    },[history]);
    React.useEffect(()=>{
        document.addEventListener("keydown", handleCloseWithReplace);
        window.addEventListener("popstate", handleCloseWithReplace);        
        return () => {
            window.removeEventListener("popstate", handleCloseWithReplace);
        };
    },[handleCloseWithReplace]);
}
