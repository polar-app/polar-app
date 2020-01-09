export class ReactRouters {
    /**
     * This is a big of a hack to support routes with hashes in them with react router.
     */
    public static createLocationWithPathAndHash(): IRouteLocation {

        const computePathname = () => {
            return document.location.hash ?
                document.location.pathname + '' + document.location.hash : document.location.pathname;

        };

        return {
            get pathname() {
                return computePathname();
            },
            get search() {
                return document.location.search;
            },
            get hash() {
                return document.location.hash;
            },
            state: null,
        };

    }

    /**
     * Only return on the path.
     */
    public static createLocationWithPathOnly(): IRouteLocation {

        return {
            get pathname() {
                return document.location.pathname;
            },
            get search() {
                return "";
            },
            get hash() {
                return "";
            },
            state: null,
        };

    }

    /**
     * Only match with the hash.
     */
    public static createLocationWithHashOnly(location: ILocation = document.location): IRouteLocation {

        return {
            get pathname() {
                return location.hash;
            },
            get search() {
                return location.hash;
            },
            get hash() {
                return location.hash;
            },
            state: null,
        };

    }

}

export interface ILocation {
    readonly pathname: string;
    readonly search: string;
    readonly hash: string;
}

export interface IRouteLocation {
    readonly pathname: string;
    readonly search: string;
    readonly hash: string;
    readonly state: null;
}
