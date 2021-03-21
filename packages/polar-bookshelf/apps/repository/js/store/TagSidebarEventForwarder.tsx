import React from 'react';
import {Tag} from "polar-shared/src/tags/Tags";

export interface TagSidebarEventForwarder {
    readonly onTagSelected: (tags: ReadonlyArray<Tag>) => void;
    readonly onDropped: (tag: Tag) => void;
}

const NullTagSidebarEventForwarder: TagSidebarEventForwarder = {
    onTagSelected: (tags: ReadonlyArray<Tag>) => console.log("WARN: using null tag selector: ", tags),
    onDropped: (tag: Tag) => console.log("WARN: using null tag selector: ", tag)
}

export const TagSidebarEventForwarderContext = React.createContext<TagSidebarEventForwarder>(NullTagSidebarEventForwarder);

export function useTagSidebarEventForwarder(): TagSidebarEventForwarder {
    return React.useContext(TagSidebarEventForwarderContext);
}
