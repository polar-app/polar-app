import * as React from 'react';

import {StoryHolder} from '../StoryHolder';
import {IAnchorProps, MUIAnchorButton} from '../../../web/js/mui/MUIAnchorButton';

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
