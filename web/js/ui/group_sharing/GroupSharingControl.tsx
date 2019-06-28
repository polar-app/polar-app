import React from 'react';
import {Contact} from '../../datastore/sharing/db/Contacts';
import {Contacts} from '../../datastore/sharing/db/Contacts';
import {ContactsSelector} from './ContactsSelector';
import {ContactOption} from './ContactsSelector';
import {ContactSelection} from './ContactsSelector';
import Button from 'reactstrap/lib/Button';
import {Profiles} from '../../datastore/sharing/db/Profiles';
import {Toaster} from '../toaster/Toaster';
import {Firebase} from '../../firebase/Firebase';
import {Groups} from '../../datastore/sharing/db/Groups';
import {Releaser} from '../../reactor/EventListener';
import {Logger} from '../../logger/Logger';
import {Doc} from '../../metadata/Doc';
import {GroupMembers} from '../../datastore/sharing/db/GroupMembers';
import {GroupMembersList} from './GroupMembersList';
import {GroupMemberInvitations} from '../../datastore/sharing/db/GroupMemberInvitations';
import {Optional} from '../../util/ts/Optional';
import {Promises} from '../../util/Promises';
import {MemberRecord} from './MemberRecords';

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

        // FIXME: move this code into a helper function so it could in theory
        // be tested...

        const doHandle = async () => {

            const user = await Firebase.currentUser();

            const docMeta = this.props.doc.docMeta;
            const fingerprint = docMeta.docInfo.fingerprint;

            const uid = user!.uid;

            const groupID = Groups.createIDForKey(uid, fingerprint);

            const profile = await Profiles.currentUserProfile();

            if (! profile) {
                throw new Error("No profile");
            }

            const getGroupMemberInvitations = async (): Promise<ReadonlyArray<MemberRecord>> => {

                const records
                    = await GroupMemberInvitations.listByGroupIDAndProfileID(groupID, profile.id);

                const memberRecordInits: MemberRecord[] = records.map(current => {

                    return {
                        profileID: current.from.profileID,
                        label: current.to,
                        created: current.created,
                        type: 'group-member-invitation',
                        value: current
                    };

                });

                const resolvedProfiles = await Profiles.resolve(memberRecordInits);

                return resolvedProfiles.map(current => {
                    const [memberRecordInit , profile] = current;

                    if (profile) {

                        return {
                            ...memberRecordInit,
                            label: profile.name || memberRecordInit.label,
                            image: Optional.of(profile.image).getOrUndefined()
                        };

                    } else {
                        return memberRecordInit;
                    }

                });

            };

            const getGroupMembers = async (): Promise<ReadonlyArray<MemberRecord>> => {

                const records
                    = await GroupMembers.list(groupID);

                const memberRecordInits: MemberRecord[] = records.map(current => {

                    return {
                        profileID: current.profileID,
                        // this is ugly but we're going to replace it below.
                        label: current.profileID,
                        created: current.created,
                        type: 'group-member-invitation',
                        value: current
                    };

                });

                const resolvedProfiles = await Profiles.resolve(memberRecordInits);

                return resolvedProfiles.map(current => {
                    const [memberRecordInit , profile] = current;

                    if (profile) {

                        return {
                            ...memberRecordInit,
                            label: profile.name || "unnamed",
                            image: Optional.of(profile.image).getOrUndefined()
                        };

                    } else {
                        return memberRecordInit;
                    }

                });

            };

            const doHandleMembership = async () => {
                const group = await Groups.get(groupID);

                if (group) {

                    // FIXME: these do not update teh states..

                    Promises.executeInBackground([
                        getGroupMembers(),
                        getGroupMemberInvitations()
                    ], err => errorHandler(err));

                }

            };

            const doHandleContacts = async () => {

                const contacts = await Contacts.list();

                if (this.releaser.released) {
                    return;
                }

                this.setState({...this.state, contacts});

            };

            Promises.executeInBackground([
                doHandleContacts(),
                doHandleMembership()
            ], err => errorHandler(err));

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
    readonly members: ReadonlyArray<MemberRecord>;
}

