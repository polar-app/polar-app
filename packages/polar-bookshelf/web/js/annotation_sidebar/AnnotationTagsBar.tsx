import Chip from "@material-ui/core/Chip";
import React from "react";
import {Tag, Tags} from "polar-shared/src/tags/Tags";
import isEqual from "react-fast-compare";
import {MUIButtonBar} from "../mui/MUIButtonBar";

interface IProps {
    readonly tags?: {[id: string]: Tag};
}

export const AnnotationTagsBar = React.memo((props: IProps) => {

    const tags = Tags.sortByLabel(Tags.onlyRegular(Object.values(props.tags || {})));

    // FIXME put a border at the bottom

    return (
        <>
            <MUIButtonBar className="mb-1">
                {tags.map(tag => <Chip key={tag.label}
                                       label={tag.label}
                                       size="small"/>)}
            </MUIButtonBar>
            {/*<div className="mb-1">*/}
            {/*    <Divider/>*/}
            {/*</div>*/}
        </>
    );

}, isEqual);
