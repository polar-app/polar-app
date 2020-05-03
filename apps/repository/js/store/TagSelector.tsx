import React from 'react';

interface TagSelector {
    readonly onTagSelected: (tags: ReadonlyArray<string>) => void;
}

const NullTagSelector: TagSelector = {
    onTagSelected: (tags: ReadonlyArray<string>) => console.log("WARN: using null tag selector: ", tags)
}

export const TagSelectorContext = React.createContext<TagSelector>(NullTagSelector);

export function useTagSelector(): TagSelector {
    return React.useContext(TagSelectorContext);
}
