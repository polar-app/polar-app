import * as React from 'react';
import {deepMemo} from "../react/ReactUtils";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {NoteScreen} from "./NoteScreen";

export const NotesRouter = deepMemo(function NotesRouter()  {

    return (
        <BrowserRouter>

            <Route path={'/'}>
                <NoteScreen/>
            </Route>

        </BrowserRouter>
    )

});
