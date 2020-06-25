import * as React from 'react';
import {GlobalHotKeys} from "react-hotkeys";

const globalKeyMap = {
    COMPLETE: ['command+return', 'control+return'],
};

interface IProps {
    readonly onComplete: () => void;
}

export const GlobalHotKeyCompleteListener = (props: IProps) => {

    const handlers = {
        COMPLETE: () => {
            console.log("FIXME: got complete");
            props.onComplete()
        }
    };

    return <GlobalHotKeys allowChanges
                          keyMap={globalKeyMap}
                          handlers={handlers}/>

};
