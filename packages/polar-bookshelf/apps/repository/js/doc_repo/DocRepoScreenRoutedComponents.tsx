import React from "react";
import {BrowserRouter, Route, Switch, useHistory} from "react-router-dom";
import {ReactRouters} from "../../../../web/js/react/router/ReactRouters";
import {DeviceRouter, DeviceRouters} from "../../../../web/js/ui/DeviceRouter";
import {RepoHeader} from "../repo_header/RepoHeader3";
import {DocRepoFilterBar} from "./DocRepoFilterBar";
import {DocRepoGlobalHotKeys} from "./DocRepoGlobalHotKeys";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import useLocationWithPathOnly = ReactRouters.useLocationWithPathOnly;
import {Helmet} from "react-helmet";

export const DocRepoScreenRoutedComponents = React.memo(function DocRepoScreenRoutedComponents() {

    const location = useLocationWithPathOnly();
    const history = useHistory();

    return (

        <BrowserRouter>
            <Switch location={location}>

                <Route exact path='/'>

                    <Helmet>
                        <title>Polar: Document Repository</title>
                    </Helmet>

                    <DeviceRouters.Desktop>
                        <DocRepoGlobalHotKeys/>
                    </DeviceRouters.Desktop>

                    <DeviceRouter.Handheld>

                        <>

                            <RepoHeader.LeftMenu>

                                <IconButton onClick={() => history.push({hash: "#folders"})}>
                                    <MenuIcon/>
                                </IconButton>

                            </RepoHeader.LeftMenu>

                            <RepoHeader.Right>
                                <DocRepoFilterBar />
                            </RepoHeader.Right>

                        </>

                    </DeviceRouter.Handheld>

                </Route>

            </Switch>
        </BrowserRouter>

    );

});
