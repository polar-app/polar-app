import React from 'react';

import {MobileDailyNotesFab} from './MobileDailyNotesFab';

export default {
    title: 'MobileDailyNotesFab',
    component: MobileDailyNotesFab,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        backgroundColor: { control: 'color' },
    },
};

export const Primary = <MobileDailyNotesFab />;

