import * as React from 'react';
import { deepMemo } from '../react/ReactUtils';

export const NotesInbound = deepMemo(() => {
    return (
        <div>
            <h3>All notes that reference this note:</h3>
        </div>
    );
});