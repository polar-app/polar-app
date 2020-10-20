import {AppRuntime} from "polar-shared/src/util/AppRuntime";
import { Platforms } from "polar-shared/src/util/Platforms";
import {isPresent} from "polar-shared/src/Preconditions";
import {useUserInfoContext} from "../apps/repository/auth_handler/UserInfoProvider";

declare var window: any;

interface IZest {
    readonly supported: boolean;
}

/**
 * This will use or inject zest and add the proper metadata
 */
export function useZest(): IZest {

    const userInfoContext = useUserInfoContext();

    const supported = ZestInjector.supportsZest();

    if (supported && ! ZestInjector.hasZest() && userInfoContext?.userInfo) {

        // only do this once we know we are supported, we haven't injected before, and we have user info.
        ZestInjector.doInject({
            id: userInfoContext?.userInfo.uid,
            name: userInfoContext.userInfo.displayName || 'none',
            email: userInfoContext.userInfo.email
        });

    }

    const trigger = () => {
        ZestInjector.triggerZest();
    }

    return {
        supported
    }

}

interface ZestUserMetadata {
    readonly id: string;
    readonly name: string;
    readonly email: string;
}

export namespace ZestInjector {

    export function doInject(user: ZestUserMetadata) {

        window.zestSettings={
            app_id:"vft7zpk4",
            contact_name: user.name,
            contact_email: user.email,
            contact_id: user.id
        };

        (function(){
            window.addEventListener("load" ,function(){
                const t=document.createElement("script");
                t.type="text/javascript";
                t.async=!0;
                t.src="https://hellozest.io/widget/"+window.zestSettings.app_id;
                document.body.appendChild(t);
            });
        })();

    }

    export function hasZest(): boolean {
        return isPresent(window.zestSettings);
    }

    export function triggerZest() {

        if (! supportsZest()) {
            console.warn("Zest not supported");
            return;
        }

    }

    /**
     * Return true if the current environment is supported.
     */
    export function supportsZest(): boolean {

        if (! AppRuntime.isBrowser()) {
            return false;
        }

        if (AppRuntime.isElectron()) {
            return false;
        }

        if (! Platforms.isDesktop()) {
            return false;
        }

        return true;

    }

}