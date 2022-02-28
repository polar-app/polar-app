import React from 'react';
import {ComponentStory} from "@storybook/react";
import {TimeToUpgradeContent} from "./TimeToUpgradeContent";
import {StorybookAppRoot} from "../../../../web/js/storybook/StorybookAppRoot";
import {BrowserRouter} from "react-router-dom";

export default {
    title: 'TimeToUpgradeContent',
    component: TimeToUpgradeContent,
    argTypes: {
    },
};

const Template = () => (
    <BrowserRouter>
        <StorybookAppRoot>
            <TimeToUpgradeContent />
        </StorybookAppRoot>
    </BrowserRouter>
);

export const Primary: ComponentStory<typeof TimeToUpgradeContent> = Template.bind({});
Primary.args = {
};
