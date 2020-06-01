import React from "react";
import {
    MUIHoverController,
    MUIHoverListener,
    MUIHoverTypeContext
} from "./MUIHoverContext";

const ListeningComponent = () => (
    <MUIHoverListener>
        <div>
            this is the component that is supposed to toggle
        </div>
    </MUIHoverListener>
);

export const MUIHoverContextDemo = () => (

    <MUIHoverController>
        <div>

            this should be the main root component

            <p>
                this is jsut another part of the component
            </p>

            <ListeningComponent/>
        </div>
    </MUIHoverController>

);

const Foo = (value: boolean) => (
    <div>foo</div>
);

export const TestRenderer = () => (
    <MUIHoverTypeContext.Consumer>
        {Foo}
    </MUIHoverTypeContext.Consumer>
);
