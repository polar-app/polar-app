/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import Button from 'reactstrap/lib/Button';
import PopoverBody from 'reactstrap/lib/PopoverBody';
import {Popover} from 'reactstrap';
import {DatastoreCapabilities} from '../../datastore/Datastore';
import {GroupSharingControl} from './GroupSharingControl';
import {Doc} from '../../metadata/Doc';
import {DocRefs} from '../../datastore/sharing/db/DocRefs';
import {FirebaseDatastores} from '../../datastore/FirebaseDatastores';
import {GroupDatastores} from '../../datastore/sharing/GroupDatastores';
import {Toaster} from '../toaster/Toaster';
import {ContactSelection} from './ContactsSelector';
import {DropdownChevron} from '../util/DropdownChevron';
import {Contacts} from '../../datastore/sharing/db/Contacts';
import {Contact} from '../../datastore/sharing/db/Contacts';
import {Logger} from '../../logger/Logger';
import {GroupMembers} from '../../datastore/sharing/db/GroupMembers';
import {Groups} from '../../datastore/sharing/db/Groups';
import {Firebase} from '../../firebase/Firebase';
import {Profile} from '../../datastore/sharing/db/Profiles';
import {Releaser} from '../../reactor/EventListener';

const log = Logger.create();

export class GroupSharingButton extends React.PureComponent<IProps, IState> {

    protected readonly releaser = new Releaser();

    constructor(props: IProps) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.doGroupProvision = this.doGroupProvision.bind(this);

        this.onDone = this.onDone.bind(this);

        this.state = {
            open: false,
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

                    this.setState({...this.state, contacts});

                });

            };

            this.releaser.register(await createGroupMembersListener());
            this.releaser.register(await createContactsListener());

        };

        doHandle().catch(err => errorHandler(err));

    }

    public componentWillUnmount(): void {
        this.releaser.release();
    }

    public render() {

        return (

            <div className="mr-1 ml-1">

                <Button color="primary"
                        id="share-control-button"
                        size="sm"
                        disabled={this.props.disabled}
                        hidden={this.props.hidden}
                        onClick={() => this.toggle(true)}
                        className="pl-2 pr-2">

                    <i className="fas fa-share"/>

                    Share

                    <DropdownChevron/>

                </Button>

                <Popover trigger="legacy"
                         placement="bottom"
                         isOpen={this.state.open}
                         toggle={() => this.toggle(false)}
                         target="share-control-button"
                         delay={0}
                         className=""
                         style={{
                             minWidth: '500px',
                             maxWidth: '800px'
                         }}>

                    <PopoverBody className="shadow">

                        <GroupSharingControl contacts={this.state.contacts}
                                             members={this.state.members}
                                             onCancel={() => this.toggle(false)}
                                             onDone={(contactSelections) => this.onDone(contactSelections)}/>

                    </PopoverBody>

                </Popover>

            </div>

        );

    }

    private toggle(open: boolean) {
        this.setState({...this.state, open});
    }

    private onDone(contactSelections: ReadonlyArray<ContactSelection>) {
        console.log("onDone...");

        this.toggle(false);
        this.props.onDone();

        this.doGroupProvision(contactSelections)
            .catch(err => Toaster.error("Could not provision group: " + err.message));

    }

    private async doGroupProvision(contactSelections: ReadonlyArray<ContactSelection>) {

        if (contactSelections.length === 0) {
            // there's nothing to be done so don't provision a group with zero
            // members.
            return;
        }

        const docMeta = this.props.doc.docMeta;
        const fingerprint = docMeta.docInfo.fingerprint;

        const docID = FirebaseDatastores.computeDocMetaID(fingerprint);
        const docRef = DocRefs.fromDocMeta(docID, docMeta);

        const message = "no message for now";
        // FIXME: this is going to be wrong and will not have profile IDs
        // there... to share with.
        const to = contactSelections.map(current => current.value);

        console.log("FIXME: sending invitation to: " , to);

        Toaster.info("Sharing document with users ... ");

        await GroupDatastores.provision({
            key: fingerprint,
            visibility: 'private',
            docs: [docRef],
            invitations: {
                message,
                to
            }
        });

        Toaster.success("Document shared successfully");

    }

}

interface IProps {

    readonly doc: Doc;

    readonly datastoreCapabilities: DatastoreCapabilities;

    readonly onDone: () => void;

    readonly disabled?: boolean;

    readonly hidden?: boolean;

}

interface IState {

    /**
     * The contacts that this user routinely shares with.
     */
    readonly contacts?: ReadonlyArray<Contact>;

    /**
     * The members of this group by profile.
     */
    readonly members?: ReadonlyArray<Profile>;

    readonly open: boolean;
}
