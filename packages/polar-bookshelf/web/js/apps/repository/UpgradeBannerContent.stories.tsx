import React from 'react';
import {ComponentStory} from "@storybook/react";
import {UpgradeBannerContent} from "./UpgradeBannerContent";
import {StorybookAppRoot} from "../../storybook/StorybookAppRoot";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export default {
    title: 'UpgradeBannerContent',
    component: UpgradeBannerContent,
};

const Template = () => (
    <StorybookAppRoot>
        <UpgradeBannerContent onClose={NULL_FUNCTION}/>
    </StorybookAppRoot>
);

export const Primary: ComponentStory<typeof UpgradeBannerContent> = Template.bind({});
Primary.args = {
};
