import React from 'react';
import {Contact} from '../../datastore/sharing/db/Contacts';
import {Contacts} from '../../datastore/sharing/db/Contacts';
import {ContactsSelector} from './ContactsSelector';
import {ContactOption} from './ContactsSelector';
import {ContactSelection} from './ContactsSelector';
import Button from 'reactstrap/lib/Button';
import {Profile} from '../../datastore/sharing/db/Profiles';
import {Toaster} from '../toaster/Toaster';
import {Firebase} from '../../firebase/Firebase';
import {Groups} from '../../datastore/sharing/db/Groups';
import {Releaser} from '../../reactor/EventListener';
import {Logger} from '../../logger/Logger';
import {Doc} from '../../metadata/Doc';
import {GroupMembers} from '../../datastore/sharing/db/GroupMembers';
import {GroupMembersList} from './GroupMembersList';

const log = Logger.create();

/**
 * Allow the user to select from one or more of their contacts.
 */
export class GroupSharingControl extends React.PureComponent<IProps, IState> {

    private contactSelections: ReadonlyArray<ContactSelection> = [];

    protected readonly releaser = new Releaser();

    constructor(props: IProps) {
        super(props);

        this.state = {
            contacts: [],
            members: []
        };

    }


    public componentDidMount(): void {

        const errorHandler = (err: Error) => {
            const msg = "Unable to get group notifications: ";
            log.error(msg, err);
            Toaster.error(msg, err.message);
        };

        const doHandle = async () => {

            const user = await Firebase.currentUser();

            const docMeta = this.props.doc.docMeta;
            const fingerprint = docMeta.docInfo.fingerprint;

            const groupID = Groups.createIDForKey(user!.uid, fingerprint);

            const createGroupMembersListener = async () => {

                return await GroupMembers.onSnapshot(groupID, records => {

                    const profileIDs = records.map(current => current.profileID);

                    // // TODO this is a bit ugly so clean it up.
                    // Profiles.resolve(profileIDs)
                    //     .then((members) => {
                    //         this.setState({...this.state, members});
                    //     })
                    //     .catch(err => errorHandler(err));

                });

            };

            const createContactsListener = async () => {
                return await Contacts.onSnapshot(contacts => {

                    if (this.releaser.released) {
                        return;
                    }

                    console.log("FIXME: state updating...");
                    this.setState({...this.state, contacts});

                });

            };

            this.releaser.register(await createContactsListener());
            this.releaser.register(await createGroupMembersListener());

        };

        console.log("FIXME: here ate least");

        doHandle().catch(err => errorHandler(err));

    }

    public componentWillUnmount(): void {
        this.releaser.release();
    }

    public render() {

        const contacts = this.state.contacts || [];

        console.log("FIXME: found contacts, ", contacts);

        // TODO: right now we only support email contacts
        const contactOptions: ReadonlyArray<ContactOption> = contacts.map(current => {
            return {
                value: current.email!,
                label: current.email!
            };
        });

        console.log("FIXME: found contactOptions, ", contactOptions);


        return <div>

            <ContactsSelector options={contactOptions}
                              onChange={contactSelections => this.contactSelections = contactSelections}/>

            <GroupMembersList members={this.state.members}/>

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
    readonly doc: Doc;
    readonly onCancel: () => void;
    readonly onDone: (contactSelections: ReadonlyArray<ContactSelection>) => void;
}

interface IState {
    readonly contacts: ReadonlyArray<Contact>;
    readonly members: ReadonlyArray<Profile>;
}
