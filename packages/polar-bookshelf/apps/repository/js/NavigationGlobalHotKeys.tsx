import React from "react";
import {useHistory} from "react-router-dom";
import {GlobalKeyboardShortcuts, keyMapWithGroup} from "../../../web/js/keyboard_shortcuts/GlobalKeyboardShortcuts";

const globalKeyMap = keyMapWithGroup(
    {
        group: "Navigation",
        keyMap: {
            DOCUMENTS: {
                name: "Go to Documents",
                description: "Go to the documents view.",
                sequences: [

                    {
                        keys: 'command+1',
                        platforms: ['macos']
                    },
                    {
                        keys: 'ctrl+1',
                        platforms: ['windows', 'linux']
                    }
                ]
            }

        }
    });

export const NavigationGlobalHotKeys = React.memo(function NavigationGlobalHotKeys() {

    const history = useHistory();

    const handleNavToDocuments = React.useCallback(() => {
        history.push("/");
    }, [history]);

    // const handleNavToAnnotations = React.useCallback(() => {
    //     history.push("/annotations");
    // }, [history]);

    // const handleNavToStatistics = React.useCallback(() => {
    //     history.push("/statistics");
    // }, [history]);

    const globalKeyHandlers = {
        DOCUMENTS: handleNavToDocuments
    };

    return (

        <GlobalKeyboardShortcuts keyMap={globalKeyMap}
                                 handlerMap={globalKeyHandlers}/>

    );

});
