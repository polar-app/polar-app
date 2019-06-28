import React from 'react';
import {Contact} from '../../datastore/sharing/db/Contacts';
import {ContactsSelector} from './ContactsSelector';
import {ContactOption} from './ContactsSelector';
import {ContactSelection} from './ContactsSelector';
import Button from 'reactstrap/lib/Button';
import {Releaser} from '../../reactor/EventListener';
import {Logger} from '../../logger/Logger';
import {Doc} from '../../metadata/Doc';
import {GroupMembersList} from './GroupMembersList';
import {MemberRecord} from './GroupSharingRecords';
import {SharingDisclaimer} from './SharingDisclaimer';

const log = Logger.create();

/**
 * Allow the user to select from one or more of their contacts.
 */
export class GroupSharingControl extends React.PureComponent<IProps, IState> {

    private contactSelections: ReadonlyArray<ContactSelection> = [];

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

            <div className="text-bold mb-1">
                Share with others
            </div>

            <ContactsSelector options={contactOptions}
                              onChange={contactSelections => this.contactSelections = contactSelections}/>

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
                        onClick={() => this.props.onDone(this.contactSelections)}
                        className="ml-1">

                    Done

                </Button>

            </div>

        </div>;

    }

}

interface IProps {
    readonly onCancel: () => void;
    readonly onDone: (contactSelections: ReadonlyArray<ContactSelection>) => void;
    readonly contacts: ReadonlyArray<Contact>;
    readonly members: ReadonlyArray<MemberRecord>;
}

interface IState {
}

