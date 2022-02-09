import React from 'react';

import {MobileDailyNotesFab} from './MobileDailyNotesFab';
import {StorybookAppRoot} from "../../../../web/js/storybook/StorybookAppRoot";
import {ComponentStory} from "@storybook/react";

export default {
    title: 'MobileDailyNotesFab',
    component: MobileDailyNotesFab,
};

const Template = () => (
    <StorybookAppRoot>
        <MobileDailyNotesFab />
    </StorybookAppRoot>
);

export const Primary: ComponentStory<typeof MobileDailyNotesFab> = Template.bind({});
Primary.args = {
};
