import {URLPathStr} from "polar-shared/src/url/PathToRegexps";
import {isPresent} from "polar-shared/src/Preconditions";

interface ILocation {
    readonly pathname: string;
    readonly hash?: string;
}

export interface RouterLinkObj extends ILocation {
}

export type RouterLink = URLPathStr | RouterLinkObj;

function isRouterLinkObj(routerLink: RouterLink): routerLink is RouterLinkObj {
    return isPresent((routerLink as any).pathname);
}

function toRouterLinkObj(routerLink: RouterLink): RouterLinkObj {

    if (isRouterLinkObj(routerLink)) {
        return routerLink;
    }

    return {pathname: routerLink};

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

        return location.pathname === pathname &&
               ILocations.canonicalizeHash(location.hash) === ILocations.canonicalizeHash(hash);

    }

}
