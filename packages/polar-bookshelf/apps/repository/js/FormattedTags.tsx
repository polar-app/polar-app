import * as React from 'react';
import {Tag} from 'polar-shared/src/tags/Tags';
import {TagChicklet} from "../../../web/js/ui/tags/TagChicklet";
import {createSiblings} from "polar-shared/src/util/Functions";

interface IProps {
    tags: {[id: string]: Tag};
}

function joinItems<T, S>(values: ReadonlyArray<T>, sep: S): ReadonlyArray<T | S> {

    const result: Array<T | S> = [];

    for (const current of createSiblings(values)) {

        result.push(current.curr);

        if (current.next) {
            result.push(sep);
        }

    }

    return result;

}

export const FormattedTags = (props: IProps) => {

    const tags = props.tags;

    const chicklets = Object.values(tags)
        .map(tag => tag.label)
        .sort()
        .map(tag => <div className="mr-1">
            <TagChicklet>
                {tag}
            </TagChicklet>
        </div>);

    // const formatted = joinItems(chicklets, <div className="pl-1 pr-1">, </div>);

    const formatted = chicklets;

    return (
        <div style={{display: 'flex'}}>
            {formatted}
        </div>
    );

};
