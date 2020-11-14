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

interface Mutator {

}

function mutatorFactory() {
    return {};
}

const useCallbacksFactory: CallbacksFactory<IInvitation, Mutator, IInvitationCallbacks> = (storeProvider, setStore, mutator) => {

    const tagStore = useTagStore(undefined)

    return class {
        public static toggleInvited() {
            const store = storeProvider();
            const invited = ! store.invited;
            setStore({invited});
        }
    };
};

export const [MyInvitationStoreProvider, useMyInvitationStore, useMyInvitationStoreCallbacks]
    = createObservableStore<IInvitation, Mutator, IInvitationCallbacks>({
        initialValue: invitationStore,
        mutatorFactory,
        callbacksFactory: useCallbacksFactory
    });
