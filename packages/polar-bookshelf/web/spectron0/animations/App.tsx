import * as React from 'react';
import {useState} from 'react';
import {HashRouter, Link, Route, Switch} from "react-router-dom";

import {AnimatePresence, motion} from 'framer-motion';

export const FadeIn = (props: any) => {

    return (
        <motion.div key="fade-in-motion"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}>

            {props.children}
        </motion.div>
    );

};

export const FadeIn2 = (props: any) => {

    const pageVariants = {
        initial: {
            opacity: 0,
        },
        in: {
            opacity: 1,
        },
        out: {
            opacity: 0,
        }
    };

    return (
        <motion.div key={"fade-in-2-motion"}
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}>

            {props.children}
        </motion.div>
    );

};

export const RightSidebar = (props: any) => {

    const style: React.CSSProperties = {
        position: 'absolute',
        right: 0,
        top: 0,
        width: '350px',
        height: '100%',
        ...props.style || {},
    };

    return (
        <motion.div key="right-sidebar"
                    initial={{ right: -350 }}
                    animate={{ right: 0 }}
                    exit={{ right: -350 }}
                    style={style}>

            {props.children}
        </motion.div>
    );

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

const RightSidebarPage = () => (

    <RightSidebar style={{backgroundColor: 'red'}}>
        <div>
            this is the left sidebar
        </div>
    </RightSidebar>

);

interface TogglerProps {
    readonly onClick: () => void;
}

const ToggleVisibilityButton = (props: TogglerProps) => (
    <button key="toggle-button-impl" onClick={() => props.onClick()}>toggle visibility</button>
);


interface ToggleFadeProps {
    readonly show: boolean;
    readonly toggle: () => void;
}

const ToggleFade = (props: ToggleFadeProps) => {

    if (props.show) {
        return (
            <div key="toggle-fade">
                <ToggleVisibilityButton key="toggle-button" onClick={() => props.toggle()}/>
                <FadeIn key="fade-in">
                    <div key="fade-content">
                        This should fade in and out on toggle
                    </div>
                </FadeIn>
            </div>
        );
    } else {
        return (
            <div key="toggle-fade">
                <ToggleVisibilityButton key="toggle-button" onClick={() => props.toggle()}/>
            </div>
        );
    }
};

const ToggleVisibilityBroken = () => {

    const [show, toggle] = useState(true);

    return (
        <AnimatePresence>
            <ToggleFade key="toggle-fade" show={show} toggle={() => toggle(! show)}/>
        </AnimatePresence>
    );

};

const ToggleVisibilityWorking = () => {

    const [show, toggle] = useState(true);

    return (
        <div>

            <ToggleVisibilityButton onClick={() => toggle( ! show)}/>

            <AnimatePresence>
                {show && (
                    <motion.div initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}>

                        <div>some stuff here</div>

                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );

};


const ToggleVisibilityWorking2 = () => {

    // tests using a nested div and the FadeIn component directly

    const [show, toggle] = useState(true);

    return (
        <div>

            <ToggleVisibilityButton onClick={() => toggle( ! show)}/>

            <AnimatePresence>
                {show && (
                    <div>
                        <FadeIn>
                            <div>some stuff here</div>
                        </FadeIn>
                    </div>
                )}

            </AnimatePresence>
        </div>
    );

};

const TestPage = () => (
    <FadeIn>test</FadeIn>
);


function computeKey() {
    const key = location.hash;
    console.log("FIXME", {key});
    return key;
}

const RoutedPage = () => (

    <HashRouter key="hash-router" hashType="noslash" basename="/">

        <div style={{display: 'flex'}}>
            <Link to="/">home</Link>
            &nbsp;
            <Link to="/second">second</Link>
            &nbsp;
            <Link to="/third">third</Link>
            &nbsp;
            <Link to="/toggler">toggler</Link>
            &nbsp;
            <Link to="/sidebar">sidebar</Link>
            &nbsp;
            <Link to="/test">test</Link>
        </div>

        <Route render={() => (
            <AnimatePresence exitBeforeEnter initial={false}>

                <Switch key={computeKey()}>

                    <Route key="0" exact path='/' component={FirstPage} />
                    <Route key="1" exact path='/second' component={SecondPage} />
                    <Route key="2" exact path='/third' component={ThirdPage} />
                    <Route key="3" exact path='/toggler' component={ToggleVisibilityWorking2} />
                    <Route key="4" exact path='/sidebar' component={RightSidebarPage} />
                    <Route key="5" exact path='/test' component={TestPage} />

                </Switch>
            </AnimatePresence>
        )}/>

    </HashRouter>

);


// This doesn't work when animating the exit animations.  Here's what I've tried:

// - I've confirmed that having a component which has a button and toggles tne presents within an AnimatePresence
//   does in fact play the exit animation.
//
// - I'm using this as a template:
//
//     https://codesandbox.io/s/framer-motion-x-react-router-n7qhp
//
//   which does work the way I want but I can't seem to get it to work when I setup
//   the same code:

export const App = () => (

    <div>
        {/*<GalleryApp/>*/}

        {/*<ToggleVisibilityWorking/>*/}

        {/*<ToggleVisibilityWorking2/>*/}

        <RoutedPage/>

    </div>

);
