import * as React from 'react';
import {HotKeys} from "react-hotkeys";
import {KeyMaps} from "../../hotkeys/KeyMaps";

const keyMap = KeyMaps.keyMap({
   group: "Actions",
   keyMap: {
       COMPLETE: {
           name: "Complete Action",
           description: "Complete the current action",
           sequences: ['command+return', 'control+return'],
       },
   }
});

interface IProps {
    readonly onComplete: () => void;
    readonly children: React.ReactElement;
}

export const HotKeyCompleteListener = (props: IProps) => {

    const handlers = {
        COMPLETE: () => {
            props.onComplete()
        }
    };

    return (
        <HotKeys allowChanges
                 keyMap={keyMap}
                 handlers={handlers}>

            {props.children}

        </HotKeys>
    );

};
