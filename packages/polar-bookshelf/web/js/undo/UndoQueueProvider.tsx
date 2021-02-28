import * as React from 'react';
import {deepMemo} from "../react/ReactUtils";
import { UndoStoreProviderDelegate } from "./UndoStore";
import { UndoQueueGlobalHotKeys } from "./UndoQueueGlobalHotKeys";

interface IProps {
    readonly children: JSX.Element;
}

export const UndoQueueProvider = deepMemo((props: IProps) => {
    return (
        <UndoStoreProviderDelegate>
            <>
                {/*<UndoQueueGlobalHotKeys/>*/}
                {props.children}
            </>
        </UndoStoreProviderDelegate>
    );
});

UndoQueueProvider.displayName='UndoQueueProvider';