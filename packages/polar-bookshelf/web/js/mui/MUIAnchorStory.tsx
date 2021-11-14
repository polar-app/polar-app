import * as React from 'react';

import {StoryHolder} from '../../../apps/stories/StoryHolder';
import {MUIAnchor} from './MUIAnchor';
import { IAnchorProps } from './MUIAnchor';

export const MUIAnchorStory = React.memo(function(props: IAnchorProps) {
    return (
        <StoryHolder>
            <div>
                <MUIAnchor href={props.href || '/'}>
                    {props.children}
                </MUIAnchor>
            </div>
        </StoryHolder>
    );

});
