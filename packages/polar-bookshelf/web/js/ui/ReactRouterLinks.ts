import {URLPathStr} from "polar-shared/src/url/PathToRegexps";
import {isPresent} from "polar-shared/src/Preconditions";
import {ILocation, ILocationWithPathAndHash} from "../react/router/ReactRouters";

export interface RouterLinkObj {
    readonly pathname: string;
    readonly hash?: string;
    readonly search?: string;
}

export type RouterLink = URLPathStr | RouterLinkObj;

function isRouterLinkObj(routerLink: RouterLink): routerLink is RouterLinkObj {
    return isPresent((routerLink as any).pathname);
}

function toRouterLinkObj(routerLink: RouterLink): RouterLinkObj {

    if (isRouterLinkObj(routerLink)) {
        return routerLink;
    }

    return {pathname: routerLink, hash: '', search: ''};

}

namespace ILocations {

    export function canonicalizeHash(hash?: string): string {

        if (! hash) {
            return "#";
        }

        if (! hash.startsWith("#")) {
            return "#" + hash;
        }

        return hash;

    }

    export function toString(location: ILocation) {
        const hash = canonicalizeHash(location.hash);
        return `${location.pathname}${hash}`
    }
}

export namespace ReactRouterLinks {

    export function isActive(target: RouterLink, location: ILocation = document.location) {

        const targetObj = toRouterLinkObj(target);

        const {pathname, hash} = targetObj;

        return location.pathname === pathname;

        // TODO we used to be more picky about the hash but really our main
        // routes are the pathname.

        // return location.pathname === pathname &&
        //        ILocations.canonicalizeHash(location.hash) === ILocations.canonicalizeHash(hash);

    }

}
