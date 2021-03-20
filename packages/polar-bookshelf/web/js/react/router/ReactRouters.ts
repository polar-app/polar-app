import { useLocation } from "react-router-dom";

export namespace ReactRouters {
    /**
     * This is a big of a hack to support routes with hashes in them with react router.
     */
    export function createLocationWithPathAndHash(): IRouteLocation {

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
    export function createLocationWithPathOnly(): IRouteLocation {

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

    export function useLocationWithPathOnly(): IRouteLocation {

        const location = useLocation();

        return {
            get pathname() {
                return location.pathname;
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
    export function createLocationWithHashOnly(location: ILocation = document.location): IRouteLocation {

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
    export function useLocationWithHashOnly(): IRouteLocation {

        const location = useLocation();

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

export interface ILocationWithPathAndHash {
    readonly pathname: string;
    readonly search: string;
    readonly hash: string;
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
