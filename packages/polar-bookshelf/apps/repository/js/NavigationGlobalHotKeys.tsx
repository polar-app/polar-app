import React from "react";
import {useDocRepoCallbacks} from "./doc_repo/DocRepoStore2";
import {BrowserRouter, Route, Switch, useHistory} from "react-router-dom";
import {ReactRouters} from "../../../web/js/react/router/ReactRouters";
import useLocationWithPathOnly = ReactRouters.useLocationWithPathOnly;
import {
    GlobalKeyboardShortcuts,
    keyMapWithGroup
} from "../../../web/js/keyboard_shortcuts/GlobalKeyboardShortcuts";

const globalKeyMap = keyMapWithGroup(
    {
        group: "Navigation",
        keyMap: {
            DOCUMENTS: {
                name: "Go to Documents",
                description: "Go to the documents view.",
                sequences: ['command+1', 'ctrl+1']
            }

        }
    });

export const NavigationGlobalHotKeys = React.memo(function NavigationGlobalHotKeys() {

    const callbacks = useDocRepoCallbacks();
    const history = useHistory();

    const handleNavToDocuments = React.useCallback(() => {
        history.push("/");
    }, [history]);

    const handleNavToAnnotations = React.useCallback(() => {
        history.push("/annotations");
    }, [history]);

    const handleNavToStatistics = React.useCallback(() => {
        history.push("/statistics");
    }, [history]);

    const globalKeyHandlers = {
        DOCUMENTS: handleNavToDocuments
    };

    return (

        <GlobalKeyboardShortcuts keyMap={globalKeyMap}
                                 handlerMap={globalKeyHandlers}/>

    );

});
