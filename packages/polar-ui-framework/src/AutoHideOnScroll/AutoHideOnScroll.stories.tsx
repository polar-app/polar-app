import React from 'react';
import {AutoHidePageLayout} from './AutoHideOnScroll';
import {LoremIpsumContent} from "../LoremIpsumContent/LoremIpsumContent";
import {StoryAppRoot} from "../StoryAppRoot/StoryAppRoot";
// import {Story} from "@storybook/react";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'AutoHideOnScroll',
    component: AutoHidePageLayout,
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// const Template = (args) => <Button {...args} />;

// const Template: Story<LogoProps> = (args) => <Logo {...args} />;

export const Primary = () => (
    <StoryAppRoot>
        <AutoHidePageLayout title="Auto Hide">
            <LoremIpsumContent/>
        </AutoHidePageLayout>
    </StoryAppRoot>
);

