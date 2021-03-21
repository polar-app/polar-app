import * as React from 'react';
import {useLocation} from 'react-router-dom';
import {NoteURLs} from "./NoteURLs";
import {NoteRoot} from "./NoteRoot";

export const NoteScreen = () => {

    const location = useLocation();

    const noteURL = NoteURLs.parse(location.pathname);

    if (! noteURL) {
        return null;
    }

    return (
        <NoteRoot target={noteURL.target}/>
    );

}
