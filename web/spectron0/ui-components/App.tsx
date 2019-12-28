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
import {AccountControl} from "../../js/ui/cloud_auth/AccountControl";
import {UserInfo} from "../../js/apps/repository/auth_handler/AuthHandler";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {ReactRouters} from "../../js/ui/ReactRouters";
import {AccountOverview} from "../../../apps/repository/js/account_overview/AccountOverview";
import milliseconds from "mocha/lib/ms";
import {DockLayout, DockPanel} from "../../js/ui/doc_layout/DockLayout";
import {ReviewFinished} from "../../../apps/repository/js/reviewer/ReviewFinished";
import {BottomSheet} from "../../js/ui/mobile/BottomSheet";
import {useSpring, animated, useTransition} from "react-spring";
import {LeftSidebar} from "../../js/ui/motion/LeftSidebar";
import {FadeIn} from "../../js/ui/motion/FadeIn";
import {SlideFromBottom} from "../../js/ui/spring/SlideFromBottom";
import {TestSpring} from "../../js/ui/spring/TestSpring";
import {useState} from "react";
import {Button} from "reactstrap";

import {motion, AnimatePresence} from 'framer-motion';
import {RightSidebar} from "../../js/ui/motion/RightSidebar";
import {HashRouter} from "react-router-dom";
import {AccountControlSidebar} from "../../../apps/repository/js/AccountControlSidebar";

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

const FirstPage = () => (
    <FadeIn>
        this is the first page
    </FadeIn>
);

const SecondPage = () => (
    <FadeIn>
        this is the second page
    </FadeIn>
);

const ThirdPage = () => (
    <div>
        this is the third page just inside a basic div
    </div>
);

const LeftSidebarPage = () => (

    <LeftSidebar style={{backgroundColor: 'red'}}>
        <div>
            this is the left sidebar
        </div>
    </LeftSidebar>

);

const RightSidebarPage = () => (

    <RightSidebar style={{backgroundColor: 'red'}} onClose={NULL_FUNCTION}>
        <div>
            this is the left sidebar
        </div>
    </RightSidebar>

);

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
        //
        // const FramerToggler = () => {
        //
        //     const [visible, toggle] = useState(true);
        //
        //     const ToggleButton = () => <Button onClick={() => toggle(! visible)}>toggle</Button>;
        //
        //     return (
        //         <AnimatePresence>
        //             <ToggleButton key={1}/>
        //             {visible && (
        //                 <motion.div
        //                     key={2}
        //                     initial={{ opacity: 0 }}
        //                     animate={{ opacity: 1 }}
        //                     exit={{ opacity: 0 }}>
        //
        //                     hello world
        //                 </motion.div>
        //             )}
        //         </AnimatePresence>
        //     );
        // };
        //
        // return <FramerToggler/>;
        const animation = {
            initial: { opacity: 0 },
            active: {
                opacity: 1,
                transition: {
                    delay: 0.3,
                    when: 'beforeChildren',
                    staggerChildren: 0.1,
                },
            },
            exit: { opacity: 0, y: 200 },
        };

        // const transition = { type: 'spring', damping, stiffness };

        const loc = ReactRouters.createLocationWithPathAndHash();

        return (

            // <BrowserRouter key="browser-router">
            //
            //     <Link to={{hash: '#'}}>home</Link>
            //     <Link to={{hash: '#second'}}>second</Link>
            //     <Link to={{hash: '#third'}}>third</Link>
            //     <Link to={{hash: '#sidebar'}}>sidebar</Link>
            //
            //     <Route render={({ location }) => (
            //         <AnimatePresence exitBeforeEnter initial={false}>
            //             <Switch location={loc}>
            //
            //                 <Route key={0} exact path='/web/spectron0/ui-components/content.html' component={FirstPage} />
            //                 <Route key={1} exact path='/web/spectron0/ui-components/content.html#second' component={SecondPage} />
            //                 <Route key={2} exact path='/web/spectron0/ui-components/content.html#third' component={ThirdPage} />
            //                 <Route key={3} exact path='/web/spectron0/ui-components/content.html#sidebar' component={RightSidebarPage} />
            //
            //             </Switch>
            //         </AnimatePresence>
            //         )}/>
            //
            // </BrowserRouter>

            //
            // <HashRouter key="hash-router" hashType="noslash">
            //
            //     HashRouter:
            //
            //     {/*NOTE: this works... but I do not want to use this syntax. I want the hash syntax.*/}
            //     {/*<Link to="/settings">settings</Link>*/}
            //     {/*<Link to="/help">help</Link>*/}
            //
            //     {/*<Link to={{hash: '#settings'}}>settings</Link>*/}
            //      {/*<Link to={{hash: '#help'}}>help</Link>*/}
            //
            //      {/*<a href="#settings">settings</a>*/}
            //      {/*<a href="#home">home</a>*/}
            //
            //     <Switch>
            //
            //         <Route path='/settings'
            //                render={() => <div>settings page</div>}/>
            //
            //         <Route path='/help'
            //                render={() => <div>help page</div>}/>
            //
            //     </Switch>
            //
            // </HashRouter>

            //
            <BrowserRouter key="browser-router">

                BrowserRouter with hash only

                <Link to="#settings">settings</Link>
                <Link to="#help">help</Link>

                <Switch location={ReactRouters.createLocationWithHashOnly()}>

                     <Route path='#settings'
                            render={() => <div>settings page</div>}/>

                     <Route path='#help'
                            render={() => <div>help page</div>}/>

                </Switch>

            </BrowserRouter>

        );

        // <Route render={({ location }) => (
        //     <AnimatePresence exitBeforeEnter>
        //         <motion.div
        //             initial={animation.initial}
        //             animate={animation.active}
        //             exit={animation.exit}
        //             // transition={transition}
        //         >
        //             <Switch location={loc}>
        //
        //                 <Route key={0} exact path='/web/spectron0/ui-components/content.html' render={() => <div>main</div>} />
        //                 <Route key={1} exact path='/web/spectron0/ui-components/content.html#second' component={SecondPage} />
        //                 <Route key={2} exact path='/web/spectron0/ui-components/content.html#third' component={() => <div>third</div>} />
        //
        //             </Switch>
        //         </motion.div>
        //     </AnimatePresence>
        // )}/>
        //


        // return (
        //
        //     <BrowserRouter key="browser-router">
        //
        //         <Link to={{hash: '#'}}>home</Link>
        //         <Link to={{hash: '#second'}}>second</Link>
        //         <Link to={{hash: '#second'}}>third</Link>
        //         <Switch location={ReactRouters.createLocationWithPathAndHash()} >
        //
        //             <Route exact path='/web/spectron0/ui-components/content.html' render={() => <div>main</div>} />
        //             <Route exact path='/web/spectron0/ui-components/content.html#second' component={SecondPage} />
        //             <Route exact path='/web/spectron0/ui-components/content.html#third' component={() => <div>third</div>} />
        //
        //         </Switch>
        //     </BrowserRouter>
        // );

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


