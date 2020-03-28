import * as React from 'react';
import {Tag} from "polar-shared/src/tags/Tags";
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";

export class TagListItem extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <div style={{display: 'flex'}}>

                <div>{this.props.tag.label}</div>

                <div className="ml-auto">
                    {this.props.tag.count}
                </div>

            </div>

        );

    }

    private onSelectedTags(selected: ReadonlyArray<Tag>) {

    }

}

interface IProps {
    readonly tag: TagDescriptor;
}

interface IState {

}
