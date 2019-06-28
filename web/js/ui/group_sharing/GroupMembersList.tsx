import React from 'react';
import {Profile} from '../../datastore/sharing/db/Profiles';
import {GroupMember} from './GroupMember';
import {MemberRecord} from './MemberRecords';

/**
 * Allow the user to select from one or more of their contacts.
 */
export class GroupMembersList extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
        };

    }

    public render() {

        const members = this.props.members || [];

        return <div>
            {members.map(item =>
                <GroupMember member={item} key={item.profileID} />)}
        </div>;

    }


}

interface IProps {
    readonly members?: ReadonlyArray<MemberRecord>;
}

interface IState {
}
