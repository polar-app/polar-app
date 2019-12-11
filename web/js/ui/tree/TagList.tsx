import * as React from 'react';
import {TagListItem} from './TagListItem';
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";

class Styles {

    public static PARENT: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--primary-background-color)',
    };

}

export class TagList extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            filter: "",
        };

    }

    public render() {


        const comparator = (a: TagDescriptor, b: TagDescriptor) => {
            const diff = a.count - b.count;

            if (diff !== 0) {
                return diff;
            }

            return a.label.localeCompare(b.label);

        };

        const tags = [...this.props.tags]
            .sort(comparator)
            .reverse();

        return (

            <div style={Styles.PARENT}>

                {tags.map(tag =>
                      <TagListItem key={tag.id} tag={tag}/>)}

            </div>

        );

    }

}

interface IProps {
    readonly tags: ReadonlyArray<TagDescriptor>;
}

interface IState {

}
