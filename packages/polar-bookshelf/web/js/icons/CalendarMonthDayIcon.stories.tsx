import React from 'react';

import {CalendarMonthDayIcon} from './CalendarMonthDayIcon';
import {StorybookAppRoot} from "../storybook/StorybookAppRoot";
import {ComponentStory} from "@storybook/react";
import IconButton from "@material-ui/core/IconButton";

export default {
    title: 'CalendarMonthDayIcon',
    component: CalendarMonthDayIcon,
};

const Template = () => (
    <StorybookAppRoot>
        <IconButton>
            <CalendarMonthDayIcon />
        </IconButton>
    </StorybookAppRoot>
);

export const Primary: ComponentStory<typeof CalendarMonthDayIcon> = Template.bind({});
Primary.args = {
};
