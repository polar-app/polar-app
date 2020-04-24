import {URLPathStr} from "polar-shared/src/url/PathToRegexps";
import {URLStr} from "polar-shared/src/util/Strings";
import {isPresent} from "polar-shared/src/Preconditions";


export interface RouterLinkObj {
    readonly pathname: string;
    readonly hash?: string;
}

export type RouterLink = URLPathStr | RouterLinkObj;

function isRouterLinkObj(routerLink: RouterLink): routerLink is RouterLinkObj {
    return isPresent((routerLink as any).pathName);
}

function toRouterLinkObj(routerLink: RouterLink): RouterLinkObj {

    if (isRouterLinkObj(routerLink)) {
        return routerLink;
    }

    return {pathname: routerLink};

}

interface ILocation {
    readonly pathname: string;
    readonly hash?: string;
}

export class ReactRouterLinks {

    public static isActive(target: RouterLink, location: ILocation = document.location) {

        const targetObj = toRouterLinkObj(target);

        const {pathname, hash} = targetObj;

        const canonicalizeHash = (hash?: string): string => {

            if (! hash) {
                return "#";
            }

            if (! hash.startsWith("#")) {
                return "#" + hash;
            }

            return hash;

        };

        return location.pathname === pathname &&
               canonicalizeHash(location.hash) === canonicalizeHash(hash);

    }

}
