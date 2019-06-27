import React from 'react';
import {Profile} from '../../datastore/sharing/db/Profiles';

/**
 * Allow the user to select from one or more of their contacts.
 */
export class GroupMember extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);

    }

    public render() {

        return <div>
            member: {this.props.member.name}
        </div>;

    }


}

interface IProps {
    readonly member: Profile;
}

interface IState {
}
