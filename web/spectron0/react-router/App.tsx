import * as React from 'react';
import {BrowserRouter, HashRouter, Link, Route, Switch} from "react-router-dom";
import {SimpleTooltipEx} from "../../js/ui/tooltip/SimpleTooltipEx";
import {Navbar} from "./Navbar";

class App<P> extends React.Component<{}, IAppState> {

    constructor(props: P, context: any) {
        super(props, context);

    }

    public render() {

        return (

            <div style={{margin: '5px'}}>

                <BrowserRouter>

                    <Switch>

                        <Route exact path='/#hello'>

                            <div>
                                <Navbar/>

                                this is the hello URL
                            </div>

                        </Route>

                        <Route exact path='/'>
                            <div>
                                <Navbar/>

                                this is the default page.
                            </div>

                        </Route>

                        <Route exact path='/user'>

                            <div>
                                <Navbar/>
                                this is the user page
                            </div>

                        </Route>

                    </Switch>

                </BrowserRouter>

            </div>

        );
    }


}

export default App;

interface IAppState {

}


