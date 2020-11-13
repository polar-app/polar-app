import React from 'react';
import {memoForwardRef} from "../../web/js/react/ReactUtils";

interface RefTrackerProps {
    readonly children: JSX.Element;
}


export type RefListenerCallback = (newRef: HTMLElement | null) => void;
export type RefListenerComponent = (props: RefTrackerProps) => JSX.Element | null;

export type RefListenerTuple = [RefListenerCallback, RefListenerComponent];


/**
 * Function that keeps a handle to the ref, and only renders the RefTracker
 * once its defined so that that the child component renders after the first is
 * defined.
 */
export function useRefTracker(): RefListenerTuple {

    const [ref, setRef] = React.useState<HTMLElement | null>(null);

    const listener = (newRef: HTMLElement | null) => {

        if (newRef !== ref) {
            setRef(newRef);
        }

    }

    const RefTracker = (props: RefTrackerProps) => {

        if (ref) {
            return props.children;
        }

        return null;

    };

    return [listener, RefTracker];

}


interface PrimaryProps {
    readonly children: React.ReactNode;
}

const Primary = memoForwardRef((props: PrimaryProps) => {
    console.log("primary render");

    const [refListener, RefTracker] = useRefTracker();

    // const [ref, setRef] = React.useState<HTMLElement | null>(null);
    //
    // function handleRef(newRef: HTMLElement |  null) {
    //     console.log('primary ref');
    //
    //     if (ref !== newRef) {
    //         console.log('got new ref');
    //         setRef(newRef);
    //     }
    //
    // }
    //
    // return (
    //     <div ref={(ref) => handleRef(ref)}>
    //         primary
    //         {ref && props.children}
    //     </div>
    // );

    return (
        <div ref={refListener}>
            primary

            <RefTracker>
                <Secondary/>
            </RefTracker>

        </div>
    );


});

const Secondary = memoForwardRef(() => {
    console.log("secondary render");
    return (
        <div>secondary</div>
    );
});

export const App = () => {

    console.log('App render')

    return (
        <div>
            <Primary>
                <Secondary/>
            </Primary>


            {/*<RefTracker>*/}
            {/*    /!*<Primary>*!/*/}
            {/*        <Secondary/>*/}
            {/*    /!*</Primary>*!/*/}
            {/*</RefTracker>*/}
        </div>
    );

}
