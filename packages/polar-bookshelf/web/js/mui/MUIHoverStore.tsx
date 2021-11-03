import {createSubscriberStore} from "../react/store/SubscriberStore";

export const [MUIHoverStoreProvider, useSetStore, useListener] =
    createSubscriberStore<boolean>();

export interface IMUIHoverListener {
    readonly onMouseEnter: () => void;
    readonly onMouseLeave: () => void;
}

export function useMUIHoverListener(): IMUIHoverListener {

    const setStore = useSetStore();

    const onMouseEnter = () => {
        setStore(true);
    };

    const onMouseLeave = () => {
        setStore(false);
    }

    return {onMouseEnter, onMouseLeave};

}

export function useMUIHoverActive(): boolean {
    return useListener();
}
