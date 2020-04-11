import * as React from "react";
import {Rnd} from "react-rnd";
import { DragAndResizeBox } from "./DragAndResizeBox";

// FIXME: click it and then enable the buttons to the bottom?

export const DragAndResizeDemo = () => (
    <div>

        <br/>
        <br/>
        <div>
            This is some inner text that we need to be able to click.. .
        </div>

        <DragAndResizeBox/>
    </div>
);
