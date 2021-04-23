import React from 'react';
import * as ReactDOM from "react-dom";
import {App} from "./App";

async function doAsync() {

    const rootElement = document.getElementById('root');

    ReactDOM.render(<App/>, rootElement);

}

doAsync().catch(err => console.error(err));
