import React from 'react';

import {CalendarMonthDayIcon} from './CalendarMonthDayIcon';
import {StorybookAppRoot} from "../storybook/StorybookAppRoot";

export default {
    title: 'CalendarMonthDayIcon',
    component: CalendarMonthDayIcon,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        backgroundColor: { control: 'color' },
    },
};

export const Primary = (
    <StorybookAppRoot>
        <CalendarMonthDayIcon />
    </StorybookAppRoot>
    )
;

