import * as React from 'react';
import {GlobalHotKeys} from "react-hotkeys";

const globalKeyMap = {
    COMPLETE: ['command+return', 'ctrl+return'],
};

interface IProps {
    readonly onComplete: () => void;
}

export const GlobalHotKeyCompleteListener = (props: IProps) => {

    const handlers = {
        COMPLETE: () => {
            props.onComplete()
        }
    };

    return <GlobalHotKeys allowChanges
                          keyMap={globalKeyMap}
                          handlers={handlers}/>

};
