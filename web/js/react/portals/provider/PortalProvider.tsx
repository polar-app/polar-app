import React from 'react';
import {createPortalProviderStore} from "./PortalProviderStore";
import ReactDOM from 'react-dom';

interface IChildren {
    readonly children: React.ReactElement;
}

export type PortalProviderType = (props: IChildren) => React.ReactElement;
export type PortalHolderType = () => React.ReactElement;
export type PortalInjectorType = (props: IChildren) => React.ReactPortal | null;

export type PortalComponents = [PortalProviderType, PortalHolderType, PortalInjectorType];

/**
 * A PortalProvider allow us to use context to inject a Portal to a parent using
 * just an a parent provider, and a child which injects the value directly.
 */
export function createPortalProvider(): PortalComponents {

    const [Provider, useStore, useCallbacks] = createPortalProviderStore();

    /**
     * The holder is the actual element that will wrap the portal element
     */
    const PortalHolder = () => {

        const {setPortal} = useCallbacks();

        function handleRef(ref: HTMLElement | null) {
            console.log("FIXME setting portal to: ", ref);
            setPortal(ref || undefined);
        }

        return (
            <div ref={ref => handleRef(ref)}/>
        )
    }

    const PortalInjector = (props: IChildren) => {

        const {portal} = useStore();

        if (portal) {
            console.log("FIXME: PortalInjector rendering it now");
            return ReactDOM.createPortal(props.children, portal);
        }
        console.log("FIXME: PortalInjector null");

        return null;

    }

    return [Provider, PortalHolder, PortalInjector];

}
