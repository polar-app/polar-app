import * as React from 'react';
import {Tags} from 'polar-shared/src/tags/Tags';
import {Group} from "../../js/datastore/sharing/db/Groups";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {TasksCalculator} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {Lorems} from "polar-shared/src/util/Lorems";
import {Task} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {FontAwesomeIcon} from "../../js/ui/fontawesome/FontAwesomeIcon";
import {Link} from "react-router-dom";
import {Lightbox} from "../../js/ui/util/Lightbox";
import {Dialogs} from "../../js/ui/dialogs/Dialogs";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {ActionButton} from "../../js/ui/mobile/ActionButton";
import {
    HolidayPromotionButton,
    HolidayPromotionCopy
} from "../../../apps/repository/js/repo_header/HolidayPromotionButton";
import {AccountControlBar} from "../../js/ui/cloud_auth/AccountControlBar";
import {UserInfo} from "../../js/apps/repository/auth_handler/AuthHandler";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {ReactRouters} from "../../js/ui/ReactRouters";
import {AccountOverview} from "../../../apps/repository/js/account_overview/AccountOverview";
import milliseconds from "mocha/lib/ms";
import {DockLayout, DockPanel} from "../../js/ui/doc_layout/DockLayout";
import {ReviewFinished} from "../../../apps/repository/js/reviewer/ReviewFinished";
import {BottomSheet} from "../../js/ui/mobile/BottomSheet";
import {useSpring, animated, useTransition} from "react-spring";
import {LeftSidebar, LeftSidebars} from "../../js/ui/spring/LeftSidebar";
import {FadeIn} from "../../js/ui/spring/FadeIn";
import {SlideFromBottom} from "../../js/ui/spring/SlideFromBottom";
import {TestSpring} from "../../js/ui/spring/TestSpring";
import {useState} from "react";
import {Button} from "reactstrap";

import {motion, AnimatePresence} from 'framer-motion';

const styles = {
    swatch: {
        width: '30px',
        height: '30px',
        float: 'left',
        borderRadius: '4px',
        margin: '0 6px 6px 0',
    }
};

const Folders = () => {
    return <div style={{backgroundColor: 'red', overflow: 'auto'}}>
        these are the folders
    </div>;
};

const Preview = () => {
    return <div style={{backgroundColor: 'orange', overflow: 'auto'}}>
        This is the preview
    </div>;
};


const Main = () => {
    return <div style={{backgroundColor: 'blue'}}>this is the right</div>;
};

export class App<P> extends React.Component<{}, IAppState> {

    constructor(props: P, context: any) {
        super(props, context);

    }

    public render() {

        const dockPanels: ReadonlyArray<DockPanel> = [
            {
                id: "left-sidebar",
                type: 'fixed',
                component: <div>left</div>,
                width: 350
            },
            {
                id: "main",
                type: 'grow',
                component: <div>main</div>,
                grow: 1
            },
            {
                id: "right-sidebar",
                type: 'fixed',
                component: <div>right</div>,
                width: 350
            }

        ];

        const MyAnimatedComponent = () => {

            const props = useSpring({
                opacity: 1,
                from: { opacity: 0 },
            });

            return <animated.h1 style={props}>hello</animated.h1>;

        };

        // const LeftSidebar = () => (
        //     <div style={{
        //              position: 'absolute',
        //              left: 0,
        //              top: 0,
        //              width: '350px',
        //              height: '100%',
        //              backgroundColor: 'orange'
        //          }}>
        //
        //     </div>
        // )

        // const LeftSidebar = (props: any) => {
        //
        //     const style = useSpring({
        //         position: 'absolute',
        //         left: 0,
        //         top: 0,
        //         width: '350px',
        //         height: '100%',
        //         from: {
        //             transform: 'translateX(-100%)'
        //         },
        //         to: {
        //             transform: 'translateX(0%)'
        //         }
        //     });
        //
        //     return <animated.div style={style}>
        //         {props.children}
        //     </animated.div>;
        //
        // };

        // const [sidebar, toggleSidebar] = LeftSidebars.create({
        //     style: {
        //         backgroundColor: 'red',
        //     },
        //     children: <div>this is the sidebar</div>
        //
        // });

        // return (
        //
        //     <div>
        //         <SlideFromBottom>
        //             this is the fade in
        //         </SlideFromBottom>
        //     </div>
        //
        // );

        // return (
        //     <BottomSheet>
        //         01. this is the bottom sheet<br/>
        //         02. this is the bottom sheet<br/>
        //         03. this is the bottom sheet<br/>
        //         04. this is the bottom sheet<br/>
        //         05. this is the bottom sheet<br/>
        //         06. this is the bottom sheet<br/>
        //         07. this is the bottom sheet<br/>
        //         08. this is the bottom sheet<br/>
        //         09. this is the bottom sheet<br/>
        //     </BottomSheet>
        // );


        // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/27805
        const Foo = (): any => {
            const [show, set] = useState(true);
            const transitions = useTransition(show, null, {
                from: {position: 'absolute', opacity: 0},
                enter: {opacity: 1},
                leave: {opacity: 0},
            });

            console.log("FIXME HERE");

            const result = transitions.map(({item, key, props}) => {
                if (item) {
                    return <animated.div key={key} style={props}>this is a single component that should vanish</animated.div>;
                } else {
                    return <animated.div key={key} style={props}></animated.div>;
                }
            });

            return result;

        };
        //
        // const FooComponent = () => {
        //
        //     const items = [
        //         <div>hello world</div>
        //     ];
        //
        //     return <Transition
        //         items={items}
        //         from={{ opacity: 0 }}
        //         enter={{ opacity: 1 }}
        //         leave={{ opacity: 0 }}>
        //         {show => show && (props => <div style={props}>this is the thing️</div>)}
        //     </Transition>;
        //
        // };
        //
        // const FooToggler = () => {
        //
        //     const [show, toggle] = useState(true);
        //
        //     const ToggleButton = () => <Button onClick={() => toggle(! show)}>toggle</Button>;
        //
        //     if (show) {
        //         return <div>
        //             <ToggleButton/>
        //             <FooComponent/>
        //         </div>;
        //     } else {
        //         return <div>
        //             <ToggleButton/>
        //         </div>;
        //     }
        //
        // };

        // const Cat = () => {
        //     const [show, set] = useState(true);
        //     const transitions = useTransition(show, null, {
        //         from: {position: 'absolute', opacity: 1},
        //         enter: {opacity: 1},
        //         leave: {opacity: 0},
        //     });
        //
        //     console.log("FIXME HERE");
        //
        //     return <animated.div key='asdf' style={props}>✌️</animated.div>;
        //
        // };

        // const Bar = () => {
        //     const [state, toggle] = useState(true)
        //     const transitions = useTransition(state, null, {  })
        //
        //     return transitions.map(({ item, key, props }) => item && <animated.div key={key} style={props}/>;
        // };

        // return <FooToggler/>;

        const FramerToggler = () => {

            const [visible, toggle] = useState(true);

            const ToggleButton = () => <Button onClick={() => toggle(! visible)}>toggle</Button>;

            return (
                <AnimatePresence>
                    <ToggleButton key={1}/>
                    {visible && (
                        <motion.div
                            key={2}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}>

                            hello world
                        </motion.div>
                    )}
                </AnimatePresence>
            );
        };

        return <FramerToggler/>;

        // const isVisible = true;
        //
        // return <AnimatePresence>
        //         {isVisible && (
        //             <motion.div
        //                 initial={{ opacity: 0 }}
        //                 animate={{ opacity: 1 }}
        //                 exit={{ opacity: 0 }}>
        //
        //                 hello world
        //             </motion.div>
        //         )}
        //     </AnimatePresence>;

        // return (
        //     // <DockLayout dockPanels={dockPanels}/>
        //
        //     // <ReviewFinished/>
        //     //
        //     // <BottomSheet>
        //     //     asdfasfd
        //     // </BottomSheet>
        //
        //
        // );

    }


}

interface IAppState {

}


