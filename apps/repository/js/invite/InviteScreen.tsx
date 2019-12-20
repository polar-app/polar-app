import * as React from 'react';
import {FixedNav, FixedNavBody} from '../FixedNav';
import {RepoHeader} from '../repo_header/RepoHeader';
import {RepoFooter} from '../repo_footer/RepoFooter';
import {PersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";
import {PersistenceLayerController} from "../../../../web/js/datastore/PersistenceLayerManager";
import {UserInfo} from "../../../../web/js/apps/repository/auth_handler/AuthHandler";
import {accounts} from "polar-accounts/src/accounts";
import {EmailAddressParser} from "../../../../web/js/util/EmailAddressParser";
import {InviteUsersContent} from "./InviteUsersContent";
import {Button} from "reactstrap";
import {Invitations} from "../../../../web/js/datastore/Invitations";
import {Logger} from "polar-shared/src/logger/Logger";

const log = Logger.create();

export class InviteScreen extends React.Component<IProps> {

    private invitedUsersText: string = "";

    constructor(props: Readonly<IProps>) {
        super(props);

        this.onInvite = this.onInvite.bind(this);
        this.onInvitedUserText = this.onInvitedUserText.bind(this);
    }

    public render() {

        return (

            <FixedNav id="doc-repository">

                <header>

                    <RepoHeader persistenceLayerProvider={this.props.persistenceLayerProvider}
                                persistenceLayerController={this.props.persistenceLayerController}/>

                </header>

                <FixedNavBody className="container-fluid bg-grey100">

                    <div className="row">

                        <div className="col-lg-12 w-100 pt-4">

                            <div className="border ml-auto mr-auto rounded p-4 bg-white"
                                 style={{
                                     maxWidth: '800px',
                                     flexGrow: 1
                                 }}>

                                <InviteUsersContent onInvitedUserText={(invitedUsersText) => this.onInvitedUserText(invitedUsersText)}/>

                                <div className="text-right">
                                    <Button color="primary"
                                            size="lg"
                                            onClick={() => this.onInvite()}>
                                        Invite
                                    </Button>
                                </div>

                            </div>

                        </div>
                    </div>

                </FixedNavBody>

                <RepoFooter/>

            </FixedNav>

        );
    }

    private onInvitedUserText(invitedUsersText: string) {
        this.invitedUsersText = invitedUsersText;
    }


    private onInvite() {

        const emailAddresses
            = EmailAddressParser.parse(this.invitedUsersText);

        const handleInvitedUsers = async () => {
            await Invitations.sendInvites(...emailAddresses);
        };

        handleInvitedUsers()
            .catch(err => log.error("Unable to invite users: ", err));

    }

}

export interface IProps {
    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly persistenceLayerController: PersistenceLayerController;
    readonly plan?: accounts.Plan;
    readonly interval?: accounts.Interval;
    readonly userInfo?: UserInfo;
}

