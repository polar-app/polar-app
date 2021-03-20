// find the scroll parent, and only show when I'm visible...
import * as React from "react";
import {useState} from "react";
import VisibilitySensor from 'react-visibility-sensor';
import AutoSizer from "react-virtualized-auto-sizer";

interface EmptyDivProps {
    readonly height: number;
}

const EmptyDiv = (props: EmptyDivProps) => {

    let ref: HTMLDivElement | null;

    return (
        <div ref={_ref => ref = _ref}
            style={{height: props.height}}>

        </div>
    );

};

interface IProps {
    readonly children: JSX.Element;
    readonly defaultHeight: number;
    readonly containment?: any;
}

interface IState {
    readonly isVisible: boolean | undefined;
    readonly height: number;
}

export const ScrollAutoLoader = (props: IProps) => {

    // FIXME: I think we have to keep the previous height cached except
    // on resize of the column.

    // FIXME this will work the first time on scroll but if we resize we don't
    // now what the height would be ...

    // FIXME now the issue is that things are going to 'blip' on the screen
    // when items are hidden/shown.
    //
    // FIXME: the first time we show the item, compute the height, then keep it
    // so that when we scroll past it

    // FIXME: this is actually more like a CHAIN of components on startup, we
    // have to display the first ALWAYS , then, if we have room, display the
    // next one...

    // FIXME: on resize, keep the scroll position by not changing the height
    // of the empty boxes,

    // FIXME: actually, I think the way this has to work is that first we display
    // the item at the estimated size... then, when it's visibile, we flip back
    // to the actual component.

    // FIXME: seems like ALL the objects come into the DOM and they all think
    // they be displayed and then stack up on top of themselves?

    // FIXME: another way this won't work is if the DOM changes and things are
    // expanded and collapsed without scrolling... though maybe we could listen
    // to the container height changing?

    // FIXME: then there's the other issue of what happens if we get a snapshot
    // update from firebase and the component is updated...

    // FIXME: on resize, reset EVERY item to the default height, take the 'top'
    // item, position and scroll to the top.  the problem is that scrolling  up
    // would be WEIRD

    const [state, setState] = useState<IState>({
        isVisible: false,
        height: props.defaultHeight
    });

    console.log("FIXME: height is being defined: ");

    let height = props.defaultHeight;

    const handleChange = (isVisible: boolean) => {

        console.log("FIXME: isVisible: ", isVisible);
        // if (state.isVisible === isVisible) {
        //     // noop
        //     return;
        // }

        setState({...state, isVisible});
    };

    const containment = document.getElementById('containment') || undefined;
    console.log("FIXME2: containment: ", containment);

    return (
        <VisibilitySensor intervalCheck={false}
                          scrollCheck={true}
                          scrollDelay={0}
                          partialVisibility={true}
                          // scrollThrottle={100}
                          resizeCheck={true}
                          resizeDelay={0}
                          // resizeThrottle={100}
                          // containment={containment}
                          onChange={isVisible => handleChange(isVisible)}>
            <>
                {/*{state.isVisible === true ? props.children :<EmptyDiv height={state.height}/>}*/}
                {state.isVisible === true ?
                    // <AutoSizer>
                    //     {size => {
                    //         // setState({
                    //         //     ...state,
                    //         //     height: size.height
                    //         // });
                    //
                    //         return props.children;
                    //     }}
                    // </AutoSizer>
                    // props.children
                    <div
                         ref={ref => {
                            height = ref?.clientHeight || props.defaultHeight
                            console.log("FIXME heiht is now: " + height);
                         }}>
                        {props.children}
                    </div>
                    :
                    <EmptyDiv height={state.height}/>
                }
            </>
        </VisibilitySensor>
    );

};

