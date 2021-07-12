import React from 'react';
import ReactDOM from 'react-dom';
import {HelloServerSideRender} from "./HelloServerSideRender";
import Cookies from "js-cookie";

export namespace SSRClient {

    export function resume() {

        // TODO
        //  - our paths match up to /notes and that we have a SSR component that represents this path

        function hasPublicAnonUser(): boolean {
            return Cookies.get('__session') === undefined;
        }

        function hasSSRMeta(): boolean {

            // look for <meta name="ssr" content="true" />

            return document.querySelector('meta[meta=ssr][content=true]') !== null;

        }

        if (hasPublicAnonUser() && hasSSRMeta()) {

            console.log("Hydrating SSR in client.")
            // TODO: we need some sort of path matching system.
            ReactDOM.hydrate(<HelloServerSideRender/>, document.getElementById('root'));

        }

    }

}
