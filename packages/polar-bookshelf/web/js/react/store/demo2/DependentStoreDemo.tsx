import React, {useState} from 'react';
import Button from "@material-ui/core/Button";
import {AlphaStoreProvider, useAlphaStore, useAlphaStoreCallbacks} from './AlphaStoreDemo';
import {BetaStoreProvider, useBetaStore, useBetaStoreCallbacks} from './BetaStoreDemo';

// function myHook() {
//     const tagStore = useTagStore()
//     console.log("FIXME: got my tagStore: ", tagStore);
// }
//
// const createdHook = () => myHook();

interface IMyCallbacks {
    readonly myCallback: () => void;
}
//
// const myCallback = () => {
//     useTagStore();
//     console.log("FIXME it worked");
// }

function myCallback() {
    // const tagStore = useTagStore();
    console.log("FIXME it worked");
}


const ChildComponent = () => {

    console.log("FIXME render");

    const alphaStore = useAlphaStore(undefined);
    const alphaCallbacks = useAlphaStoreCallbacks();

    const betaStore = useBetaStore(undefined);
    const betaCallbacks = useBetaStoreCallbacks();

    return (
        <div>
            individual names: <br/>

            alpha: {alphaStore.name} <br/>
            beta: {betaStore.name} <br/>

            <Button variant="contained"
                    onClick={() => alphaCallbacks.setName("alpha-changed")}>
                change alpha
            </Button>

            <Button variant="contained"
                    onClick={() => betaCallbacks.setName("beta-changed")}>
                change beta
            </Button>

            <br/>
            names from store perspective:

            alpha: <br/>

            <blockquote>
                alpha: {alphaCallbacks.names().alpha} <br/>
                beta: {alphaCallbacks.names().beta} <br/>
            </blockquote>

            beta: {betaStore.name} <br/>

            <blockquote>
                alpha: {betaCallbacks.names().alpha} <br/>
                beta: {betaCallbacks.names().beta} <br/>
            </blockquote>

        </div>
    );

}


const IntermediateComponent = () => {

    return (
        <div>
            <ChildComponent/>
        </div>
    )
}

export const DependentStoreDemo = () => {

    return (
        <AlphaStoreProvider>
            <BetaStoreProvider>
                <IntermediateComponent/>
            </BetaStoreProvider>
        </AlphaStoreProvider>
    );

};
