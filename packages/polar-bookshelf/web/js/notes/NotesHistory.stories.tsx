import React from 'react';
import {NotesHistory, NotesHistoryProps} from "./NotesHistory";
import {ComponentStory} from "@storybook/react";
import {StorybookAppRoot} from "../storybook/StorybookAppRoot";
import {BrowserRouter} from "react-router-dom";
import {AppBar, Toolbar} from "@material-ui/core";


export default {
    title: 'NotesHistory',
    component: NotesHistory,
};

const Template = (args: NotesHistoryProps) => (
    <StorybookAppRoot>
        <BrowserRouter>
            <AppBar color={"inherit"} position="static">
                <Toolbar>
                    <NotesHistory {...args} />
                </Toolbar>
            </AppBar>
        </BrowserRouter>
    </StorybookAppRoot>
);

export const WithoutHistory: ComponentStory<typeof NotesHistory> = Template.bind({});
WithoutHistory.args = {
    history: [
        {title: 'Boulder', path: '/notes/Boulder'}
    ]
};

export const WithoutOneHistoryItem: ComponentStory<typeof NotesHistory> = Template.bind({});
WithoutOneHistoryItem.args = {
    history: [
        {title: 'Daily Notes', path: '/daily'},
        {title: 'Boulder', path: '/notes/Boulder'}
    ]
};
