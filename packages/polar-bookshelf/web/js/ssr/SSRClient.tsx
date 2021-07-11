import React from 'react';
import ReactDOM from 'react-dom';

import {HelloServerSideRender} from "./HelloServerSideRender";

export namespace SSRClient {

    export function resume() {
        // TODO: we need some sort of path matching system.
        ReactDOM.hydrate(<HelloServerSideRender/>, document.getElementById('root'));
    }

}
