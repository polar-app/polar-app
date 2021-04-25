import {Route} from "react-router-dom";
import * as React from "react";
import {RouteProps} from "react-router";
import {AnimatePresence} from "framer-motion";

export const AnimatedRoute = (props: IProps) => {
    return <AnimatePresence>
        <Route {...props}/>
    </AnimatePresence>;
};

interface IProps extends RouteProps {

}
