import React from 'react';
import {ComponentStory} from "@storybook/react";
import {AppLoadingProgress} from "./AppLoadingProgress";
import {StorybookAppRoot} from '../../storybook/StorybookAppRoot';

export default {
    title: 'AppLoadingProgress',
    component: AppLoadingProgress,
    argTypes: {
    },
};

const Template = () => (
    <StorybookAppRoot>
        <AppLoadingProgress />
    </StorybookAppRoot>
);

export const Primary: ComponentStory<typeof AppLoadingProgress> = Template.bind({});
Primary.args = {
};
