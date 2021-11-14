import * as React from 'react';
import {StoryHolder} from '../../../apps/stories/StoryHolder';
import {MUIAnchor} from './MUIAnchor';

export const MUIAnchorStory = React.memo(function MUIAnchorStory() {
    return (
        <StoryHolder>
            <div>
                <MUIAnchor href='/'>
                    This is an anchor
                </MUIAnchor>
            </div>
        </StoryHolder>
    );

});
