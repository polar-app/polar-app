import {BrowserRouter, Link, Route, Switch, useLocation, useHistory} from "react-router-dom";
import {AnimatePresence} from "framer-motion";
import {FadeIn} from "../../js/ui/motion/FadeIn";
import * as React from "react";
import {ReactRouters} from "../../js/react/router/ReactRouters";
import {RightSidebar} from "../../js/ui/motion/RightSidebar";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

const FirstPage = () => {

    return (
        <FadeIn>
            <div>this is the first page</div>
        </FadeIn>
    );
};

const SecondPage = () => (
    <FadeIn>
        <div>this is the second page</div>
    </FadeIn>
);

const ThirdPage = () => (
    <div>
        this is the third page just inside a basic div
    </div>
);

const RightSidebarPage = () => (

    <RightSidebar style={{backgroundColor: 'red'}} onClose={NULL_FUNCTION}>
        <div>
            this is the right sidebar
        </div>
    </RightSidebar>

);

const AnimatedSwitch = (props: any) => {

    const location = useLocation();
    const history = useHistory();

    return (
        <AnimatePresence exitBeforeEnter={false}
                         initial={false}
                         custom={{ action: history.action }}>
            <Switch location={ReactRouters.createLocationWithHashOnly()}
                    key={location.hash}>

                {props.children}

            </Switch>
        </AnimatePresence>
    );

}

// https://codesandbox.io/s/ios-transitions-with-framer-motion-q1ick
export const AnimatedRoutes = () => {

    return (
        <BrowserRouter key="browser-router">

            <Link to='#'>home</Link>
            <Link to='#second'>second</Link>
            <Link to='#third'>third</Link>
            <Link to='#sidebar'>sidebar</Link>

            <AnimatedSwitch>
                <Route exact path='#' component={FirstPage} />
                <Route exact path='#second' component={SecondPage} />
                <Route exact path='#third' component={ThirdPage} />
                <Route exact path='#sidebar' component={RightSidebarPage} />
            </AnimatedSwitch>

        </BrowserRouter>

    );


};
