import React from 'react';
import {ComponentStory} from "@storybook/react";
import {useErrorHandler} from "./useErrorHandler";
import {StorybookAppRoot} from "../storybook/StorybookAppRoot";
import {BrowserRouter} from "react-router-dom";
import {AdaptiveDialog} from "./AdaptiveDialog";

export default {
    title: 'useErrorHandler',
    component: useErrorHandler,
};

const Demo = () => {

    const errorHandler = useErrorHandler();

    React.useEffect(() => {

        errorHandler("something messed up happened")

    }, [errorHandler])

    return null;

}

const Template = () => (

    <StorybookAppRoot>
        <BrowserRouter>

            {/*<Switch>*/}
            {/*    <Route path="/" component={InviteScreen}/>*/}

            {/*</Switch>*/}

            <AdaptiveDialog>
                <p>
                    This is some stuff
                </p>
            </AdaptiveDialog>

            <Demo />

        </BrowserRouter>
    </StorybookAppRoot>

);

export const Primary: ComponentStory<any> = Template.bind({});
Primary.args = {
};
