import React from 'react';
import {ContactsSelector} from './ContactsSelector';
import Button from 'reactstrap/lib/Button';
import {Logger} from '../../logger/Logger';
import {GroupMembersList} from './GroupMembersList';
import {MemberRecord} from './GroupSharingRecords';
import {ContactProfile} from './GroupSharingRecords';
import Input from 'reactstrap/lib/Input';
import {UserRef} from '../../datastore/sharing/rpc/UserRefs';
import {ContactOptions} from './ContactOptions';

const log = Logger.create();

/**
 * Allow the user to select from one or more of their contacts.
 */
export class GroupSharingControl extends React.Component<IProps, IState> {

    private contactSelections: ReadonlyArray<UserRef> = [];

    private message: string = "";

    constructor(props: IProps) {
        super(props);

        this.state = {
            contacts: [],
            members: []
        };

    }

    public render() {

        const contactProfiles = this.props.contactProfiles || [];

        const contactOptions = ContactOptions.toContactOptions(contactProfiles);

        return <div className="text-md">

            <div className="font-weight-bold mb-1">
                Share with others:
            </div>

            <ContactsSelector options={contactOptions}
                              onChange={contactSelections => this.contactSelections = contactSelections}/>

            <div className="mt-2">

                <Input type="textarea"
                       name="message"
                       className="p-2 text-md"
                       placeholder="Message to send with the invitation ..."
                       style={{
                           width: '100%',
                           height: '5em'
                       }}
                       onChange={event => this.message = event.target.value}/>

            </div>

            <GroupMembersList members={this.props.members} onDelete={this.props.onDelete}/>

            {/*<SharingDisclaimer/>*/}

            <div className="mt-2 text-right">

                <Button color="secondary"
                        size="sm"
                        onClick={() => this.props.onCancel()}
                        className="ml-1">

                    Cancel

                </Button>


                <Button color="primary"
                        size="sm"
                        onClick={() => this.props.onDone({
                            contactSelections: this.contactSelections,
                            message: this.message
                        })}
                        className="ml-1">

                    Done

                </Button>

            </div>

        </div>;

    }

}

interface IProps {
    readonly onCancel: () => void;
    readonly onDone: (invitation: InvitationRequest) => void;
    readonly onDelete: (member: MemberRecord) => void;
    readonly contactProfiles: ReadonlyArray<ContactProfile>;
    readonly members: ReadonlyArray<MemberRecord>;
}

interface IState {
}

/**
 * A user initiated invitation with metadata before its' written
 */
export interface InvitationRequest {
    readonly contactSelections: ReadonlyArray<UserRef>;
    readonly message: string;
}
