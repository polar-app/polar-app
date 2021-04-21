import React from 'react';
import isEqual from "react-fast-compare";
import {HashRouter, Link, Switch} from "react-router-dom";
import {Route} from "react-router-dom";
import {PersistentRoute} from "./PersistentRoute";

export const PersistentRouteDemo = React.memo(function PersistentRouteDemo() {

    return (

        <div>

            these are the persistent routes


            <HashRouter>

                <Link to="/hello">
                    hello
                </Link>

                <Link to="/world">
                    world
                </Link>

                <PersistentRoute exact path='/hello' strategy="display">
                    <div>this is the hello page</div>
                </PersistentRoute>

                <Switch>


                    <Route exact path='/world'>
                        <div>this is the world page</div>
                    </Route>

                </Switch>

            </HashRouter>


        </div>

    );

}, isEqual);
