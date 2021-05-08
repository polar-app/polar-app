import React from 'react';
import {MUITagListItem} from "./MUITagListItem";
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";
import {Tags} from "polar-shared/src/tags/Tags";
import TagID = Tags.TagID;
import {SelectRowType} from '../doc_repo/SelectionEvents2';

interface IProps {
    readonly tags: ReadonlyArray<TagDescriptor>;
    readonly selected: ReadonlyArray<string>;
    readonly selectRow: (node: TagID, event: React.MouseEvent, source: SelectRowType) => void
    readonly onDrop: (event: React.DragEvent, tagID: TagID) => void;
}

export const MUITagList = (props: IProps) => {

    const {selected} = props;

    return (
        <>
            {props.tags.map(tag => <MUITagListItem key={tag.id}
                                                   selected={selected.includes(tag.id)}
                                                   selectRow={props.selectRow}
                                                   nodeId={tag.id}
                                                   label={tag.label}
                                                   onDrop={props.onDrop}
                                                   info={tag.count}/>)}
        </>
    );
}
