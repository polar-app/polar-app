

export interface RouterLink {
    readonly pathname: string;
    readonly hash?: string;
}

interface ILocation {
    readonly pathname: string;
    readonly hash?: string;
}

export class ReactRouterLinks {

    public static isActive(target: RouterLink, location: ILocation = document.location) {

        const {pathname, hash} = target;

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
