import * as React from 'react';
import {deepMemo} from "../react/ReactUtils";
import { UndoStoreProviderDelegate } from "./UndoStore";
import { UndoQueueGlobalHotKeys } from "./UndoQueueGlobalHotKeys";

export const UndoQueueProvider = deepMemo(() => {
    return (
        <UndoStoreProviderDelegate>
            <UndoQueueGlobalHotKeys/>
        </UndoStoreProviderDelegate>
    );
})