import React from "react";
import {BrowserRouter, Route, Switch, useHistory} from "react-router-dom";
import {ReactRouters} from "../../../../web/js/react/router/ReactRouters";
import {AnnotationRepoGlobalHotKeys} from "./AnnotationRepoGlobalHotKeys";
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";
import {RepoHeader} from "../repo_header/RepoHeader3";
import {AnnotationRepoFilterBar2} from "./AnnotationRepoFilterBar2";
import useLocationWithPathOnly = ReactRouters.useLocationWithPathOnly;


export const AnnotationRepoRoutedComponents = React.memo(() => {

    const location = useLocationWithPathOnly();
    const history = useHistory();

    return (

        <BrowserRouter>
            <Switch location={location}>

                <Route exact path='/annotations'>

                    <DeviceRouter.Desktop>
                        <AnnotationRepoGlobalHotKeys/>
                    </DeviceRouter.Desktop>

                    <DeviceRouter.Handheld>

                        <>

                            <RepoHeader.Right>
                                <AnnotationRepoFilterBar2/>
                            </RepoHeader.Right>

                        </>
                    </DeviceRouter.Handheld>

                </Route>

            </Switch>
        </BrowserRouter>

    );

});
