import * as React from "react";
import {Elements} from "../../js/util/Elements";

interface BufferProps {
    readonly height: number;
    readonly className: string;
}


const Buffer = (props: BufferProps) => (
    <div style={{height: props.height}}
         className={props.className}>

    </div>
);

interface IProps {

    readonly elements: ReadonlyArray<JSX.Element>;

    /**
     * Function to get the estimated size of the item in the elements.
     */
    readonly getSize: (index: number) => number;

}

interface IState {
    readonly offset: number;
    readonly view: ReadonlyArray<JSX.Element>;
}

// TODO: just make this testable so that it's not in the UI but that I can test
// the functions on scroll

// keep track of the head height, the footer height, the scroll top, and bottom
//
// FIXME: a BETTER way way to do this woudl be to have a wrapper/holder div
// that doesn't display if the item is off the screen significantly..

export const VariableInfiniteLoader = () => {

    // need to get the parent scroll height.

    // const scrollParent = Elements.getScrollParent();

    return (
        <div>



        </div>
    );

}




