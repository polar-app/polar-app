import * as React from 'react';

import { StoryHolder } from '../../../apps/stories/StoryHolder';
import { MUIAnchor2 } from '../../../web/js/mui/MUIAnchor2';
import { IAnchorProps } from '../../../web/js/mui/buttons/MUIAnchorButton';

export const MUIAnchorStory = React.memo(function(props: IAnchorProps) {
    return (
        <StoryHolder>
            <div>
                <MUIAnchor2 href={props.href || '/'}>
                    {props.children}
                </MUIAnchor2>
            </div>
        </StoryHolder>
    );
    
});