import React from 'react';
import ReactDOM from 'react-dom';

import {HelloServerSideRender} from "./HelloServerSideRender";

export namespace SSRClient {

    export function resume() {

        // FIXME: only attempt ot hydrate if there is no __session cookie
        // and our paths match up.

        // TODO: we need some sort of path matching system.
        ReactDOM.hydrate(<HelloServerSideRender/>, document.getElementById('root'));
    }

}
