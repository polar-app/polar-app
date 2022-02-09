import React from 'react';

import {CalendarMonthDayIcon} from './CalendarMonthDayIcon';

export default {
    title: 'MUICalendarMonthDayIcon',
    component: CalendarMonthDayIcon,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        backgroundColor: { control: 'color' },
    },
};

export const Primary = <CalendarMonthDayIcon />;

