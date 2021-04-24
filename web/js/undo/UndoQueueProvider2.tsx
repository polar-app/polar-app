import * as React from 'react';
import {deepMemo} from "../react/ReactUtils";
import { UndoStoreProviderDelegate } from "./UndoStore";
import { UndoQueueGlobalHotKeys } from "./UndoQueueGlobalHotKeys";
import {UndoQueues2} from "./UndoQueues2";

interface IProps {
    readonly children: JSX.Element;
}

const UndoQueueContext = React.createContext(UndoQueues2.create());

export function useUndoQueue() {
    return React.useContext(UndoQueueContext);
}

export const UndoQueueProvider2 = deepMemo(function UndoQueueProvider(props: IProps) {
    return (
        <UndoStoreProviderDelegate>
            <>
                {/*<UndoQueueGlobalHotKeys/>*/}
                {props.children}
            </>
        </UndoStoreProviderDelegate>
    );
});
