import React from "react";
import {GlobalHotKeys} from "react-hotkeys";
import {KeyMaps} from "../../../../web/js/hotkeys/KeyMaps";

const keyMap = KeyMaps.keyMap({
    group: "Reviewer",
    keyMap: {
    }
});

export const ReviewerGlobalHotKeys = React.memo(() => {

    // return (
    //     <GlobalHotKeys allowChanges={true}
    //                    keyMap={keyMap}
    //                    handlers={globalKeyHandlers}/>
    //
    // );

    return null;

});
