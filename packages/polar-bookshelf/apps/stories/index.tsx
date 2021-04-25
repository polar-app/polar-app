import React from 'react';
import * as ReactDOM from "react-dom";
import {StoriesApp} from "./StoriesApp";

async function doAsync() {

    const rootElement = document.getElementById('root');

    ReactDOM.render(<StoriesApp/>, rootElement);

}

doAsync().catch(err => console.error(err));
