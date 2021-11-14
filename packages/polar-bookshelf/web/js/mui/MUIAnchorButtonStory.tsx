import * as React from 'react';

import {MUIAnchorButton} from '../../../web/js/mui/MUIAnchorButton';
import { IAnchorProps } from '../../../web/js/mui/MUIAnchor';
import { StoryHolder } from '../../../apps/stories/StoryHolder';

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
