import * as React from 'react';

import {MUIAnchorButton} from '../../../web/js/mui/MUIAnchorButton';
import {StoryHolder} from '../../../apps/stories/StoryHolder';

export const MUIAnchorButtonStory = React.memo(() => {

    return (
        <StoryHolder>
            <div>
                <MUIAnchorButton href={"https://www.example.com"}>
                    Link to example.com
                </MUIAnchorButton>
            </div>
        </StoryHolder>
    );

});
