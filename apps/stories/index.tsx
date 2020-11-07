import React from 'react';
import * as ReactDOM from "react-dom";
import {StoryApp} from "./StoryApp";

async function doAsync() {

    const rootElement = document.getElementById('root');

    ReactDOM.render(<StoryApp/>, rootElement);

}

doAsync().catch(err => console.error(err));
