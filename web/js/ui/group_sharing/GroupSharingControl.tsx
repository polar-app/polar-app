import React from 'react';
import {Contact} from '../../datastore/sharing/db/Contacts';
import {ContactsSelector} from './ContactsSelector';
import {ContactOption} from './ContactsSelector';
import {ContactSelection} from './ContactsSelector';
import Button from 'reactstrap/lib/Button';
import {Logger} from '../../logger/Logger';
import {GroupMembersList} from './GroupMembersList';
import {MemberRecord} from './GroupSharingRecords';
import Input from 'reactstrap/lib/Input';
import NavItem from 'reactstrap/lib/NavItem';
import Nav from 'reactstrap/lib/Nav';
import NavLink from 'reactstrap/lib/NavLink';
import TabContent from 'reactstrap/lib/TabContent';

const log = Logger.create();

/**
 * Allow the user to select from one or more of their contacts.
 */
export class GroupSharingControl extends React.Component<IProps, IState> {

    private contactSelections: ReadonlyArray<ContactSelection> = [];

    private message: string = "";

    constructor(props: IProps) {
        super(props);

        this.state = {
            contacts: [],
            members: []
        };

    }

    public render() {

        const contacts = this.props.contacts || [];

        // TODO: right now we only support email contacts
        const contactOptions: ReadonlyArray<ContactOption> = contacts.map(current => {
            return {
                value: current.email!,
                label: current.email!
            };
        });

        console.log("FIXME: found contactOptions, ", contactOptions);

        return <div>

            <div className="font-weight-bold mb-1">
                Share with others:
            </div>

            <ContactsSelector options={contactOptions}
                              onChange={contactSelections => this.contactSelections = contactSelections}/>

            <div className="mt-1">

                <Input type="textarea"
                       name="message"
                       className="p-2"
                       placeholder="Message to send with the invitation ..."
                       style={{
                           width: '100%',
                           height: '5em'
                       }}
                       onChange={event => this.message = event.target.value}/>

            </div>

            <GroupMembersList members={this.props.members}/>

            {/*<SharingDisclaimer/>*/}

            <div className="mt-1 text-right">

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
    readonly contacts: ReadonlyArray<Contact>;
    readonly members: ReadonlyArray<MemberRecord>;
}

interface IState {
}

/**
 * A user initiated invitation with metadata before its' written
 */
export interface InvitationRequest {
    readonly contactSelections: ReadonlyArray<ContactSelection>;
    readonly message: string;
}
