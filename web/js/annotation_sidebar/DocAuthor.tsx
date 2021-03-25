import * as React from 'react';
import {IAuthor} from "polar-shared/src/metadata/IAuthor";
import {UserAvatar} from '../ui/cloud_auth/UserAvatar';
import isEqual from "react-fast-compare";

interface IProps {
    readonly author?: IAuthor;
}

/**
 * A generic wrapper that determines which sub-component to render.
 */
export const DocAuthor = React.memo(function DocAuthor(props: IProps) {

    const {author} = props;

    if (author && author.image) {
        return <UserAvatar photoURL={props.author?.image?.src}
                           displayName={props.author?.name}/>;
    } else {
        return null;
    }

}, isEqual);



