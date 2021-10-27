import React from 'react';
import {StoryAppRoot} from "../StoryAppRoot/StoryAppRoot";
import LogoAndTextSideBySide from './LogoAndTextSideBySide';
import {StoryHolder} from "../StoryHolder/StoryHolder";

export default {
    title: 'LogoAndTextSideBySide',
    component: LogoAndTextSideBySide,
};

export const Primary = () => (
    <StoryAppRoot>
        <StoryHolder>
            <LogoAndTextSideBySide/>
        </StoryHolder>
    </StoryAppRoot>
);

