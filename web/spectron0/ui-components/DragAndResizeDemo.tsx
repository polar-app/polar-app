import * as React from "react";
import {Rnd} from "react-rnd";

const DragAndResizeBox = () => (
    <Rnd
        default={{
            x: 10,
            y: 10,
            width: 320,
            height: 200,
        }}
        style={{
            backgroundColor: 'rgba(0, 0, 255, 0.6)'
        }}>

    </Rnd>
)

export const DragAndResizeDemo = () => (
    <div>
        <DragAndResizeBox/>
    </div>
);
