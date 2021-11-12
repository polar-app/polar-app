import * as React from 'react';

import { StoryHolder } from '../../../apps/stories/StoryHolder';
import { IAnchorProps, MUIAnchorButton } from '../../../web/js/mui/buttons/MUIButton';

export const MUIButtonStory = React.memo((props: IAnchorProps) => {
        
    return (
        <StoryHolder>
            <div>
                <MUIAnchorButton {...props} to={props.href || {}}>
                    {props.children}
                </MUIAnchorButton>
            </div>
        </StoryHolder>
    );
    
});