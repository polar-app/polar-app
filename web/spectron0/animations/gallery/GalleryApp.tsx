import React from "react";
import ReactDOM from "react-dom";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {SingleImage} from "./SingleImage";
import {Gallery} from "./Gallery";
import {HashRouter} from "react-router-dom";


export const GalleryApp = () => (
    <HashRouter key="browser-router" hashType="noslash" basename="/">
        <Route render={({ location }) => (
                <AnimatePresence exitBeforeEnter initial={false}>
                    <Switch location={location} key={location.pathname}>
                        <Route exact path="/" component={Gallery} />
                        <Route exact path="/image/:id" component={SingleImage} />
                    </Switch>
                </AnimatePresence>
            )}
        />
    </HashRouter>
);
