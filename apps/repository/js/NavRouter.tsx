import {BrowserRouter, Route, Switch} from "react-router-dom";
import {AccountControlSidebar} from "./AccountControlSidebar";
import * as React from "react";
import {PersistenceLayerProvider} from "../../../web/js/datastore/PersistenceLayer";
import {ReactRouters} from "../../../web/js/ui/ReactRouters";

interface IProps {
    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly children?: any;
}

export const NavRouter = (props: IProps) => (

    <BrowserRouter key="hash-router">

        <Switch location={ReactRouters.createLocationWithHashOnly()}>

            <Route path='#settings'
                   render={() => <AccountControlSidebar persistenceLayerProvider={props.persistenceLayerProvider}/>}/>

            {props.children}

        </Switch>

    </BrowserRouter>

);
