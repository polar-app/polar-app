import * as React from "react";
import {DataLoader} from "../../../../web/js/ui/data_loader/DataLoader";
import {Tag} from "polar-shared/src/tags/Tags";
import {PersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";
import {
    AuthHandlers,
    UserInfo
} from "../../../../web/js/apps/repository/auth_handler/AuthHandler";
import {SnapshotSubscribers} from "../../../../web/js/firebase/SnapshotSubscribers";

export class UserInfoDataLoader extends React.Component<IProps, IState> {

    public render() {

        const persistenceLayer = this.props.persistenceLayerProvider();

        if (! persistenceLayer) {
            return null;
        }

        const asyncProvider = async () => {

            // FIXME:this needs to be removed now.
            const userInfo = await AuthHandlers.get().userInfo();

            if (userInfo.isPresent()) {
                return userInfo.get();
            } else {
                return undefined;
            }

        };

        const provider = SnapshotSubscribers.createFromAsyncProvider(asyncProvider);

        return (
            <DataLoader id="userInfo"
                        provider={provider}
                        render={userInfo => this.props.render(userInfo)}/>
        );

    }

}

export interface IProps {
    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly render: (userInfo: UserInfo | undefined) => React.ReactElement;
}

interface IState {

}

export type UserTags = ReadonlyArray<Tag>;
