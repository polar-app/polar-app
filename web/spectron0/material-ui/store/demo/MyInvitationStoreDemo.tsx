import React, {useState} from 'react';
import {CallbacksFactory, createObservableStore} from "../ObservableStore";
import Button from "@material-ui/core/Button";
import { TagStoreProvider, useTagStore } from './TagStoreDemo';
import {useTagsContext} from "../../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";

interface MyInvitation {
    readonly invited: boolean;
}

interface MyInvitationCallbacks {
    readonly toggleInvited: () => void;
}

const invitationStore: MyInvitation = {
    invited: false
}

const callbacksFactory: CallbacksFactory<MyInvitation, MyInvitationCallbacks> = (store, setStore) => {
    return {
        toggleInvited: () => {
            const tagStore = useTagStore()
            console.log("FIXME2: toggling invited: ", tagStore);
            const invited = ! store.current.invited;
            setStore({invited});
        }
    }
};

export const [MyInvitationStoreProvider, useMyInvitationStore, useMyInvitationStoreCallbacks]
    = createObservableStore<MyInvitation, MyInvitationCallbacks>(invitationStore, callbacksFactory);
