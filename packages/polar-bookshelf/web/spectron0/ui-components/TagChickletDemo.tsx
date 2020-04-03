import * as React from "react";

import {TagChicklet} from "../../js/ui/tags/TagChicklet";

export const TagChickletDemo = () => (
    <div className="m-1" style={{display: 'flex'}}>
        <div className="mr-1">
            <TagChicklet>linux</TagChicklet>
        </div>
        <TagChicklet>microsoft</TagChicklet>
    </div>
);
