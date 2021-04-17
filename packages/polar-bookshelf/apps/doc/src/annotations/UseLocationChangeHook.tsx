import React from 'react';
import {ILocation} from "../../../../web/js/react/router/ReactRouters";
import {useHistory} from "react-router-dom";

export type ListenerUnsubscriber = () => void;

export type IListener<T> = (value: T) => void;

export interface IListenable<T> {
    readonly listen: (listener: IListener<T>) => ListenerUnsubscriber;
}

/**
 * location is defined only when it updates.
 */
export function useLocationUpdateListener(): IListenable<ILocation> {

    const history = useHistory();
    const first = React.useRef(true);

    function listen(listener: (location: ILocation) => void) {

        return history.listen(newLocation => {

            if (! first.current) {
                listener(newLocation);
            }

            first.current = false;

        });

    }

    return {listen};

}
