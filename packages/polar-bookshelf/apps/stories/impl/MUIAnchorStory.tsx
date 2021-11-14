import * as React from 'react';

import {StoryHolder} from '../../../apps/stories/StoryHolder';
import {MUIAnchor} from '../../../web/js/mui/MUIAnchor';
import {IAnchorProps} from '../../../web/js/mui/MUIAnchorButton';

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
