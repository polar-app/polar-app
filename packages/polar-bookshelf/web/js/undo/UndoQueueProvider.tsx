import * as React from 'react';
import {deepMemo} from "../react/ReactUtils";
import {UndoStoreProviderDelegate} from "./UndoStore";

interface IProps {
    readonly children: JSX.Element;
}

export const UndoQueueProvider = deepMemo(function UndoQueueProvider(props: IProps) {
    return (
        <UndoStoreProviderDelegate>
            <>
                {/*<UndoQueueGlobalHotKeys/>*/}
                {props.children}
            </>
        </UndoStoreProviderDelegate>
    );
});
