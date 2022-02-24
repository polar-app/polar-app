import React from 'react';
import {ComponentStory} from "@storybook/react";
import {TimeToUpgradeContent} from "./TimeToUpgradeContent";
import {StorybookAppRoot} from "../../../../web/js/storybook/StorybookAppRoot";

export default {
    title: 'TimeToUpgradeContent',
    component: TimeToUpgradeContent,
    argTypes: {
    },
};

const Template = () => (
    <StorybookAppRoot>
        <TimeToUpgradeContent/>
    </StorybookAppRoot>
);

export const Primary: ComponentStory<typeof TimeToUpgradeContent> = Template.bind({});
Primary.args = {
};
