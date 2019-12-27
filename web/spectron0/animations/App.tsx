import * as React from 'react';
import {useState} from 'react';
import {HashRouter, Link, Route, Switch} from "react-router-dom";

import {AnimatePresence, motion} from 'framer-motion';

export const FadeIn = (props: any) => {

    return (
        <motion.div initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}>

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
    <button onClick={() => props.onClick()}>toggle visibility</button>
);


interface ToggleFadeProps {
    readonly show: boolean;
    readonly toggle: () => void;
}

const ToggleFade = (props: ToggleFadeProps) => {

    if (props.show) {
        return (
            <div>
                <ToggleVisibilityButton onClick={() => props.toggle()}/>
                <FadeIn>This should fade in and out on toggle</FadeIn>
            </div>
        );
    } else {
        return (
            <div>
                <ToggleVisibilityButton onClick={() => props.toggle()}/>
            </div>
        );
    }
};

const ToggleVisibility = () => {

    const [show, toggle] = useState(true);


    return (
        <AnimatePresence>
            <ToggleFade show={show} toggle={() => toggle(! show)}/>
        </AnimatePresence>
    );

};

// This doesn't work when animating the exit animations.  Here's what I've tried:

// - I've confirmed that having a component which has a button and toggles tne presents within an AnimatePresence
//   does in fact play the exit animation.

export const App = () => (

    <HashRouter key="browser-router" hashType="noslash" basename="/">
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
        </div>

        <Route render={({ location }) => (
            <AnimatePresence exitBeforeEnter initial={false}>

                <Switch>

                    <Route exact path='/' component={FirstPage} />
                    <Route exact path='/second' component={SecondPage} />
                    <Route exact path='/third' component={ThirdPage} />
                    <Route exact path='/toggler' component={ToggleVisibility} />
                    <Route exact path='/sidebar' component={RightSidebarPage} />

                </Switch>
            </AnimatePresence>
        )}/>

    </HashRouter>

);
