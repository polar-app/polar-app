import * as React from 'react';

import {StoryHolder} from '../../../apps/stories/StoryHolder';
import {MUIAnchorButton} from './MUIAnchorButton';
import { IAnchorProps } from './MUIAnchor';

export const MUIAnchorButtonStory = React.memo((props: IAnchorProps) => {

    return (
        <StoryHolder>
            <div>
                <MUIAnchorButton {...props}>
                    {props.children}
                </MUIAnchorButton>
            </div>
        </StoryHolder>
    );

});
