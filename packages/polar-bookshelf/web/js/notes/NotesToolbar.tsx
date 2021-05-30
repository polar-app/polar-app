import React from 'react';
import {SearchForNote} from "./toolbar/SearchForNote";

export const NotesToolbar = () => {
    return (
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <SearchForNote/>
        </div>
    )
}
