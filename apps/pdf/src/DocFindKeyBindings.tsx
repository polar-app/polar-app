import React from 'react';
import {Callbacks} from "../../repository/js/Callbacks";
import {GlobalHotKeys} from "react-hotkeys";
import {useDocViewerCallbacks} from './DocViewerStore';

const globalKeyMap = {
    FIND: ['command+f', 'control+f']
};

export const DocRepoKeyBindings = React.memo(() => {

    const callbacks = useDocViewerCallbacks();

    const globalKeyHandlers = Callbacks.callbacksWithTimeout({
        FIND: () => callbacks.setFindActive(true),
    });

    return (

        <GlobalHotKeys allowChanges={true}
                       keyMap={globalKeyMap}
                       handlers={globalKeyHandlers}/>

    );

});
