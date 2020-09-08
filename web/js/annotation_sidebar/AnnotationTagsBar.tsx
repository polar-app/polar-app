import Chip from "@material-ui/core/Chip";
import React from "react";
import {Tag, Tags} from "polar-shared/src/tags/Tags";
import {MUIButtonBar} from "../mui/MUIButtonBar";
import {deepMemo} from "../react/ReactUtils";

interface IProps {
    readonly tags?: {[id: string]: Tag};
}

export const AnnotationTagsBar = deepMemo((props: IProps) => {

    // TODO: remove document tags too.. .
    const tags = Tags.sortByLabel(Tags.onlyRegular(Object.values(props.tags || {})));

    return (
        <>
            <MUIButtonBar className="mb-1"
                          style={{overflow: 'hidden'}}>
                {tags.map(tag => <Chip key={tag.label}
                                       style={{
                                           userSelect: 'none'
                                       }}
                                       label={tag.label}
                                       size="small"/>)}
            </MUIButtonBar>
        </>
    );

});
