import React from 'react';
import {MemberRecord} from './GroupSharingRecords';

/**
 * Allow the user to select from one or more of their contacts.
 */
export class GroupMember extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

    }

    public render() {

        return <div>
            {this.props.member.label}
        </div>;

    }


}

interface IProps {
    readonly member: MemberRecord;
}

interface IState {
}
