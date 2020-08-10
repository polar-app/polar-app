import React from 'react';
import {useLocation} from 'react-router-dom';
import {HashURLs} from "polar-shared/src/util/HashURLs";
import {IDStr} from "polar-shared/src/util/Strings";
import {ILocation} from "../../../../web/js/react/router/ReactRouters";

// interface IProps {
//     // readonly children: () => JSX.Element;
//     // readonly children: React.ReactNode;
//     readonly children: React.ReactElement<React.RefAttributes<HTMLElement>>;
//
//     // readonly children: React.ForwardRefRenderFunction<HTMLDivElement, any>;
//     // readonly children: React.ReactNode;
// }
//
// const ForwardRefComponent = React.forwardRef<HTMLDivElement>((props: any, ref) => {
//     return <div ref={ref}>hello</div>
// });
//
// const TestUsage = () => {
//     return (
//         <>
//             <ScrollIntoViewUsingLocation>
//                 <ForwardRefComponent/>
//             </ScrollIntoViewUsingLocation>
//         </>
//     );
// }

/**
 * Simple component that takes a child, and then when we're given a param of
 * 'target=123' then we scroll to that component
 */
// export const ScrollIntoViewUsingLocation = React.memo((props: IProps) => {
//
//     const scrollTarget = useScrollTargetFromLocation();
//     const ref = React.useRef<HTMLElement>();
//
//     if (scrollTarget && ref.current) {
//
//         const id = ref.current.getAttribute('id');
//
//         if (id !== scrollTarget) {
//             // TODO: this component should take scrollIntoView opts and pass
//             // them here.
//             ref.current.scrollIntoView();
//         }
//
//     }
//
//     const Child = props.children;
//
//     return (
//         <Child ref={ref}/>
//     );
//
// })

export function useLocationHashChangeCallback(callback: () => void) {

    const location = useLocation();
    const prevLocation = React.useRef<ILocation | undefined>(undefined);

    try {

        if (location.hash !== prevLocation.current?.hash) {
            callback();
        }

    } finally {
        prevLocation.current = location;
    }

}

export function useScrollIntoViewUsingLocation() {

    // FIXME: this is beign triggered on scroll too which is part of the
    // problem here...

    // FIXME: ok.. I think the issue is that this is being triggered during
    // the scroll and since it's scrolling itself this is causing a major race
    // issue

    const scrollTarget = useScrollTargetFromLocation();
    const prevScrollTarget = React.useRef<string | undefined>();
    const ref = React.useRef<HTMLElement | null>(null);

    const handleLocation = React.useCallback(() => {

        console.log("FIXME: handleLocation");

        if (scrollTarget) {

            if (ref.current) {

                const id = ref.current.getAttribute('id');

                if (id === scrollTarget) {

                    if (scrollTarget !== prevScrollTarget.current) {
                        console.log("Scrolling target into view: " + scrollTarget, ref);
                        // TODO: this component should take scrollIntoView opts and pass
                        // them here.
                        ref.current.scrollIntoView();
                    } else {
                        console.log(`FIXME 4 for id=${id}, scrollTarget=${scrollTarget}`);
                    }

                } else {
                    console.log(`FIXME 3 for id=${id}, scrollTarget=${scrollTarget}`);
                }

            } else {
                console.log(`FIXME 2 for scrollTarget=${scrollTarget}`);
            }

        } else {
            console.log(`FIXME 1 for scrollTarget=${scrollTarget}`);
        }

    }, []);

    // FIXME: I can solve this by only executing this code when the location
    // changes not when we actually scroll ...

    // FIXME what about a scroll listener so that I can reset so we can jump
    // back again ... ?

    useLocationHashChangeCallback(handleLocation);

    return (newRef: HTMLElement | null) => {

        if (ref.current !== newRef) {
            /// FIXME: this is getting updated when it shouldn't be...
            console.log("FIXME: updating ref... ")
            // only set when we have a newRef so that we don't re-trigger a
            // render
            ref.current = newRef;
        }

    }

}


/**
 * The target of a scroll which should be a DOM ID.
 */
export type ScrollTarget = IDStr;

namespace ScrollTargets {

    import QueryOrLocation = HashURLs.QueryOrLocation;

    export function parse(queryOrLocation: QueryOrLocation): ScrollTarget | undefined{

        const params = HashURLs.parse(queryOrLocation);
        return params.get('target') || undefined;

    }

}


/**
 * Use location to parse the annotation.
 */
export function useScrollTargetFromLocation(): ScrollTarget | undefined {
    // TODO: I don't think this is cached across components...
    const location = useLocation();
    return ScrollTargets.parse(location);
}
