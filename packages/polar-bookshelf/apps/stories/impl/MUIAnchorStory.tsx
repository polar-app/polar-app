import * as React from 'react';
import { URLPathStr } from 'polar-shared/src/url/PathToRegexps';
import { URLStr } from 'polar-shared/src/util/Strings';

import { StoryHolder } from '../../../apps/stories/StoryHolder';
import { MUIAnchor2 } from '../../../web/js/mui/MUIAnchor2';

interface IAnchorProps {
    readonly href: URLStr | URLPathStr;
    readonly children: React.ReactNode;
}


export const MUIAnchorStory = React.memo(function(props: IAnchorProps) {
    return (
        <StoryHolder>
            <div>
                <MUIAnchor2 href={props.href}>
                    {props.children}
                </MUIAnchor2>
            </div>
        </StoryHolder>
    );
    
});