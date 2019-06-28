import React from 'react';
import {Contact} from '../../datastore/sharing/db/Contacts';
import {ContactSelection} from './ContactsSelector';
import {Toaster} from '../toaster/Toaster';
import {Firebase} from '../../firebase/Firebase';
import {Groups} from '../../datastore/sharing/db/Groups';
import {Releaser} from '../../reactor/EventListener';
import {Logger} from '../../logger/Logger';
import {Doc} from '../../metadata/Doc';
import {Preconditions} from '../../Preconditions';
import {MemberRecord} from './GroupSharingRecords';
import {GroupSharingRecords} from './GroupSharingRecords';
import {GroupSharingControl} from './GroupSharingControl';
import {InvitationRequest} from './GroupSharingControl';

const log = Logger.create();

/**
 * Allow the user to select from one or more of their contacts.
 */
export class GroupSharing extends React.Component<IProps, IState> {

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


        const contactsHandler = (contacts: ReadonlyArray<Contact>) => {

            if (this.releaser.released) {
                return;
            }

            this.setState({...this.state, contacts});

        };

        const membersHandler = (members: ReadonlyArray<MemberRecord>) => {

            console.log("FIXME memberS: ", members);

            if (this.releaser.released) {
                return;
            }

            this.setState({...this.state, members});

        };

        const doHandle = async () => {

            const docMeta = this.props.doc.docMeta;
            const fingerprint = docMeta.docInfo.fingerprint;

            const user = await Firebase.currentUser();
            Preconditions.assertPresent(user, 'user');
            const uid = user!.uid;

            const groupID = Groups.createIDForKey(uid, fingerprint);

            GroupSharingRecords.fetch(groupID,
                                      contacts => contactsHandler(contacts),
                                      members => membersHandler(members),
                                      err => errorHandler(err));

        };

        doHandle().catch(err => errorHandler(err));

    }

    public componentWillUnmount(): void {
        this.releaser.release();
    }

    public render() {
        return <GroupSharingControl {...this.props} {...this.state}/>;
    }

}

interface IProps {
    readonly doc: Doc;
    readonly onCancel: () => void;
    readonly onDone: (invitation: InvitationRequest) => void;
}

interface IState {
    readonly contacts: ReadonlyArray<Contact>;
    readonly members: ReadonlyArray<MemberRecord>;
}

