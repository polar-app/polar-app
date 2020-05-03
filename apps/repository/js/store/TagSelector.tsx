import React from 'react';
import {Tag} from "polar-shared/src/tags/Tags";

interface TagSelector {
    readonly onTagSelected: (tags: ReadonlyArray<Tag>) => void;
}

const NullTagSelector: TagSelector = {
    onTagSelected: (tags: ReadonlyArray<Tag>) => console.log("WARN: using null tag selector: ", tags)
}

export const TagSelectorContext = React.createContext<TagSelector>(NullTagSelector);

export function useTagSelector(): TagSelector {
    return React.useContext(TagSelectorContext);
}
