import React from 'react';
import {ComponentStory} from "@storybook/react";
import {WelcomeScreenContent} from "./WelcomeScreenContent";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {StorybookAppRoot} from "../../storybook/StorybookAppRoot";
import {AdaptiveDialog} from "../../mui/AdaptiveDialog";

export default {
    title: 'WelcomeScreenContent',
    component: WelcomeScreenContent,
};

const Template = () => (
    <StorybookAppRoot>
        <AdaptiveDialog>
            <WelcomeScreenContent onProfile={NULL_FUNCTION}/>
        </AdaptiveDialog>
    </StorybookAppRoot>
);

export const Primary: ComponentStory<typeof WelcomeScreenContent> = Template.bind({});
Primary.args = {
};
