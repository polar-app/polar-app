import React, {useState} from 'react';
import {
    CallbacksFactory,
    createObservableStore,
    ObservableStore, SetStore
} from "../ObservableStore";
import Button from "@material-ui/core/Button";
import { TagStoreProvider, useTagStore } from './TagStoreDemo';
import {useTagsContext} from "../../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";

interface IInvitation {
    readonly invited: boolean;
}

interface IInvitationCallbacks {
    readonly toggleInvited: () => void;
}

const invitationStore: IInvitation = {
    invited: false
}

class InvitationCallbacks {

    // private readonly tagStore = useTagStore()
    constructor(private readonly store: ObservableStore<IInvitation>,
                private readonly setStore: SetStore<IInvitation>) {

    }

    public toggleInvited() {
        const invited = ! this.store.current.invited;
        this.setStore({invited});
    }

}

const callbacksFactory: CallbacksFactory<IInvitation, IInvitationCallbacks> = (storeProvider, setStore) => {

    const tagStore = useTagStore()

    return class {
        public static toggleInvited() {
            const store = storeProvider();
            const invited = ! store.invited;
            setStore({invited});
        }
    };
};

// const callbacksFactory2: CallbacksFactory<IInvitation, IInvitationCallbacks> = (storeProvider, setStore) => {
//
//     return new InvitationCallbacks(storeProvider, setStore);
//
// };


export const [MyInvitationStoreProvider, useMyInvitationStore, useMyInvitationStoreCallbacks]
    = createObservableStore<IInvitation, IInvitationCallbacks>(invitationStore, callbacksFactory);
