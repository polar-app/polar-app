import React from 'react';
import * as ReactDOM from "react-dom";
import {App} from "./App";

async function doAsync() {

    const rootElement = document.getElementById('root');

    // FIXME: call
    //  document.createRange()
    // then specify the start, end, then call getBoundingClientRect on it.. .then
    // use that to paint the element.

    ReactDOM.render(<App/>, rootElement);

}

doAsync().catch(err => console.error(err));
