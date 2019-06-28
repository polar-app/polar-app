import React from 'react';
import {MemberRecord} from './MemberRecords';

/**
 * Allow the user to select from one or more of their contacts.
 */
export class GroupMember extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);

    }

    public render() {

        return <div>
            member: {this.props.member.label}
        </div>;

    }


}

interface IProps {
    readonly member: MemberRecord;
}

interface IState {
}
