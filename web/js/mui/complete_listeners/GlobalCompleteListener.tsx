import * as React from 'react';
import {GlobalHotKeys} from "react-hotkeys";

const globalKeyMap = {
    COMPLETE: ['command+enter', 'control+enter'],
};

interface IProps {
    readonly onComplete: () => void;
}

export const GlobalCompleteListener = (props: IProps) => {

    const handlers = {
        COMPLETE: () => props.onComplete()
    };

    return <GlobalHotKeys keyMap={globalKeyMap} handlers={handlers}/>

};
