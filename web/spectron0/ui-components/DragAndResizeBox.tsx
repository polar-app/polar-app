import {Rnd} from "react-rnd";
import * as React from "react";
import {useState} from "react";
import {Callback, NULL_FUNCTION} from "polar-shared/src/util/Functions";

interface InnerBoxProps {
    readonly onMouseOver: Callback;
    readonly onMouseOut: Callback;
}

const InnerBox = (props: InnerBoxProps) => {

    console.log("FIXMEl rendiner indner box")

    return (
        <div style={{
            backgroundColor: 'red',
            flexGrow: 1
        }}
             onMouseOver={() => props.onMouseOver()}
             onMouseOut={() => props.onMouseOut()}
             className="m-1">

        </div>
    );

};

interface IProps {

}

interface IState {
    readonly active: boolean;
}

export class DragAndResizeBox extends React.Component<IProps, IState> {

    constructor(props: Readonly<IProps>) {
        super(props);

        this.state = {
            active: false
        }

    }

    public render() {

        const id = "foo";

        console.log('FIXME rendering');

        // FIXME: migrate this to using state with active and we use
        // pointerEvents: 'auto' by default and then we flip it to 'none'
        // once we're in the middle of the box.

        const pointerEvents = this.state.active ? 'none' : 'auto';

        const handleMouseOver = () => {
            // document.getElementById(id)!.style.pointerEvents = 'none';
            this.setState({active: true});
            console.log("FIXME: over");
        };

        const handleMouseOut = () => {
            // document.getElementById(id)!.style.pointerEvents = 'auto';

            // this.setState({active: false});
            console.log("FIXME: out");
        };

        // FIXME antoher way to fix this would be to have FOUR rects around the
        // main div to just listen to the mouse movements.

        // FIXME: ok, I can do it with my own edge components!!! the main
        // needs pointerEvents: none and the edge components need to keep it...
        //
        // bottom?: React.CSSProperties,
        //     bottomLeft?: React.CSSProperties,
        //     bottomRight?: React.CSSProperties,
        //     left?: React.CSSProperties,
        //     right?: React.CSSProperties,
        //     top?: React.CSSProperties,
        //     topLeft?: React.CSSProperties,
        //     topRight?: React.CSSProperties


        // force pointer events on the resize corners.
        const resizeHandleStyle: React.CSSProperties = {
            pointerEvents: 'auto'
        };

        return (
            <Rnd
                id={id}
                default={{
                    x: 10,
                    y: 10,
                    width: 320,
                    height: 200,
                }}
                disableDragging={true}
                resizeHandleStyles={{
                    bottom: resizeHandleStyle,
                    bottomLeft: resizeHandleStyle,
                    bottomRight: resizeHandleStyle,
                    top: resizeHandleStyle,
                    topLeft: resizeHandleStyle,
                    topRight: resizeHandleStyle,
                    left: resizeHandleStyle,
                    right: resizeHandleStyle
                }}
                style={{
                    backgroundColor: 'rgba(0, 0, 255, 0.6)',
                    mixBlendMode: 'multiply',
                    pointerEvents: 'none',
                    display: 'flex'
                }}>

                <InnerBox onMouseOver={() => handleMouseOver()}
                          onMouseOut={NULL_FUNCTION}/>

                {/*there is an onResizeStop and onDragStop we can use to persist.*/}

            </Rnd>
        );

    }
}
