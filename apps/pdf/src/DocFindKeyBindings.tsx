import React from 'react';
import {Callbacks} from "../../repository/js/Callbacks";
import {GlobalHotKeys} from "react-hotkeys";
import {useDocViewerCallbacks} from './DocViewerStore';
import { useDocFindCallbacks } from './DocFindStore';

const globalKeyMap = {
    FIND: ['command+f', 'control+f']
};

export const DocRepoKeyBindings = React.memo(() => {

    const callbacks = useDocFindCallbacks();

    const globalKeyHandlers = Callbacks.callbacksWithTimeout({
        FIND: () => callbacks.setActive(true),
    });

    return (

        <GlobalHotKeys allowChanges={true}
                       keyMap={globalKeyMap}
                       handlers={globalKeyHandlers}/>

    );

});
