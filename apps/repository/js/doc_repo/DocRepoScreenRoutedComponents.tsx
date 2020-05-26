import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {ReactRouters} from "../../../../web/js/react/router/ReactRouters";
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";
import {RepoHeader} from "../repo_header/RepoHeader3";
import {DocRepoFilterBar} from "./DocRepoFilterBar";
import {DocRepoGlobalHotKeys} from "../../../../web/spectron0/material-ui/doc_repo_table/DocRepoGlobalHotKeys";
import useLocationWithPathOnly = ReactRouters.useLocationWithPathOnly;


export const DocRepoScreenRoutedComponents = React.memo(() => {

    const location = useLocationWithPathOnly();

    return (

        <BrowserRouter>
            <Switch location={location}>

                <Route exact path='/'>

                    <DeviceRouter.Desktop>
                        <DocRepoGlobalHotKeys/>
                    </DeviceRouter.Desktop>

                    <DeviceRouter.Handheld>
                        <RepoHeader.Right>
                            <DocRepoFilterBar />
                        </RepoHeader.Right>
                    </DeviceRouter.Handheld>

                </Route>

            </Switch>
        </BrowserRouter>

    );

});
