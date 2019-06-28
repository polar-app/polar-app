import React from 'react';
import {MemberRecord} from './GroupSharingRecords';
import Button from 'reactstrap/lib/Button';
import {NULL_FUNCTION} from '../../util/Functions';

/**
 * Allow the user to select from one or more of their contacts.
 */
export class GroupMember extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

    }

    public render() {

        const {member} = this.props;

        return <div style={{display: 'flex'}}>

            <div className="mt-auto mb-auto"
                 style={{
                     flexGrow: 1,
                 }}>

                <div className="mt-auto mb-auto">
                    {member.label}
                </div>

            </div>

            <div className="mt-auto mb-auto">

                <div className="mt-auto mb-auto"
                     style={{
                         display: 'flex'
                     }}>

                    <div className="mt-auto mb-auto">
                        {member.type}
                    </div>

                    <div className="mt-auto mb-auto ml-1">
                        <Button color="light"
                                size="sm"
                                onClick={NULL_FUNCTION}
                                className="pl-2 pr-2">

                            <i className="fas fa-trash"/>

                        </Button>
                    </div>

                </div>
            </div>

        </div>;

    }


}

interface IProps {
    readonly member: MemberRecord;
}

interface IState {
}
