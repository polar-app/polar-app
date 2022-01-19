import React from 'react';
import {NotesHistory, NotesHistoryProps} from "./NotesHistory";
import {ComponentStory} from "@storybook/react";


export default {
    title: 'NotesHistory',
    component: NotesHistory,
};

const Template = (args: NotesHistoryProps) => <NotesHistory {...args} />;

export const WithoutHistory: ComponentStory<typeof NotesHistory> = Template.bind({});
WithoutHistory.args = {
    history: []
};

export const WithoutOneHistoryItem: ComponentStory<typeof NotesHistory> = Template.bind({});
WithoutOneHistoryItem.args = {
    history: [
        {title: 'Daily Notes', path: '/daily'}
    ]
};
