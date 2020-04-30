import React, {useState} from 'react';
import {CallbacksFactory, createObservableStore} from "../ObservableStore";
import Button from "@material-ui/core/Button";
import { TagStoreProvider } from './TagStoreDemo';

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
            console.log("FIXME: toggling invited");
            const invited = ! store.current.invited;
            setStore({invited});
        }
    }
};

export const [MyInvitationStoreProvider, useMyInvitationStore, useMyInvitationStoreCallbacks]
    = createObservableStore<MyInvitation, MyInvitationCallbacks>(invitationStore, callbacksFactory);
