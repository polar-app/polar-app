import React from "react";
import {Route, Switch, useHistory} from "react-router-dom";
import {ReactRouters} from "../../../../web/js/react/router/ReactRouters";
import {AnnotationRepoGlobalHotKeys} from "./AnnotationRepoGlobalHotKeys";
import {DeviceRouter, DeviceRouters} from "../../../../web/js/ui/DeviceRouter";
import {RepoHeader} from "../repo_header/RepoHeader3";
import {AnnotationRepoFilterBar} from "./AnnotationRepoFilterBar";
import {Helmet} from "react-helmet";
import useLocationWithPathOnly = ReactRouters.useLocationWithPathOnly;

export const AnnotationRepoRoutedComponents = React.memo(function AnnotationRepoRoutedComponents() {

    const location = useLocationWithPathOnly();
    const history = useHistory();

    return (
        <Switch location={location}>

            <Route exact path='/annotations'>

                <Helmet>
                    <title>Polar: Annotation Repository</title>
                </Helmet>

                <DeviceRouters.Desktop>
                    <AnnotationRepoGlobalHotKeys/>
                </DeviceRouters.Desktop>

                <DeviceRouter.Handheld>

                    <>

                        <RepoHeader.Right>
                            <AnnotationRepoFilterBar/>
                        </RepoHeader.Right>

                    </>
                </DeviceRouter.Handheld>

            </Route>

        </Switch>
    );

});
