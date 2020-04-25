import * as React from 'react';
import {IAuthor} from "polar-shared/src/metadata/IAuthor";
import {UserAvatar} from '../ui/cloud_auth/UserAvatar';


/**
 * A generic wrapper that determines which sub-component to render.
 */
export class DocAuthor extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {
        const {author} = this.props;

        if (author && author.image) {
            return <UserAvatar photoURL={this.props.author?.image?.src}
                               displayName={this.props.author?.name}/>;
        } else {
            return <div/>;
        }

    }

}
interface IProps {
    readonly author?: IAuthor;
}

interface IState {

}


