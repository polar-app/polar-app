import React from 'react';
import {AutoClozeDeletionIcon} from "./AutoClozeDeletionIcon";
import {StorybookAppRoot} from "../storybook/StorybookAppRoot";
import {ComponentStory} from "@storybook/react";
import IconButton from "@material-ui/core/IconButton";

export default {
    title: 'AutoClozeDeletionIcon',
    component: AutoClozeDeletionIcon,
    argTypes: {
        backgroundColor: { control: 'color' },
    },
};

const Template = () => (
    <StorybookAppRoot>
        <IconButton>
            <AutoClozeDeletionIcon />
        </IconButton>
    </StorybookAppRoot>
);

export const Primary: ComponentStory<typeof AutoClozeDeletionIcon> = Template.bind({});
Primary.args = {
};
