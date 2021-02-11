import React from "react";
import {FolderSidebar2} from "../../../../apps/repository/js/folders/FolderSidebar2";
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";
import {
    ITagsContext, PersistenceContext,
    TagsContext
} from "../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";

function createTagDescriptor(tag: string, count: number): TagDescriptor {
    return {
        id: tag,
        label: tag,
        count,
        members: []
    };
}

const tagDescriptors: ReadonlyArray<TagDescriptor> = [
    createTagDescriptor('linux', 101),
    createTagDescriptor('microsoft', 200),
    createTagDescriptor('/compsci/linux', 20),
    createTagDescriptor('/compsci/google', 100),
    createTagDescriptor('/compsci/stanford/cs101', 220),
    createTagDescriptor('/compsci/stanford/cs102', 215),
];


const FolderSidebarDemo = () => {
    return (
        <FolderSidebar2/>
    );
}

const tagsContext: ITagsContext = {
    // userTagsProvider: () => tagDescriptors,
    // docTagsProvider: () => tagDescriptors,
    // annotationTagsProvider: () => tagDescriptors,
    tagsProvider: () => tagDescriptors
}

export const MUITreeViewDemo = () => {
    return (
        <div>
            <TagsContext.Provider value={tagsContext}>
                <FolderSidebarDemo/>
            </TagsContext.Provider>
        </div>
    );
}


// <TreeView
//     selected={[]}
//     expanded={['1', '2']}
//     // onNodeSelect={}
// >
//     <TreeItem nodeId="1"
//               label="root">
//
//         <TreeItem nodeId="2"
//                      label="2">
//
//             <TreeItem nodeId="3"
//                          label="3"
//             />
//
//         </TreeItem>
//     </TreeItem>
//
// </TreeView>
