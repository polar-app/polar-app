import React from 'react';
import {MemberRecord} from './GroupSharingRecords';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {ConfirmProps} from "../dialogs/ConfirmProps";
import Button from "@material-ui/core/Button";

/**
 * Allow the user to select from one or more of their contacts.
 */
export class GroupMemberEntry extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.onDelete = this.onDelete.bind(this);

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

                        <Button variant="contained"
                                onClick={() => this.onDelete(member)}
                                className="pl-2 pr-2">

                            <i className="fas fa-trash"/>

                        </Button>

                    </div>

                </div>
            </div>

        </div>;

    }

    private onDelete(member: MemberRecord) {

        const opts: ConfirmProps = {
            title: 'Delete group member?',
            subtitle: 'Are you sure you want to delete this group member?',
            type: 'warning',
            onConfirm: () => this.props.onDelete(member),
            onCancel: NULL_FUNCTION
        };
        // TODO: mui/groups migration / legacy
        //
        // Dialogs.confirm(opts);

    }


}

interface IProps {
    readonly member: MemberRecord;
    readonly onDelete: (member: MemberRecord) => void;
}

interface IState {
}
