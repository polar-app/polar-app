import {useLocationChangeStore} from "./UseLocationChangeStore";
import {ILocation} from "../../../../web/js/react/router/ReactRouters";

/**
 * Like useLocation but we only return the location on page load OR when the
 * location actually changes.  This way components that re-mount don't get
 * called with a new / initial location.
 */
export function useLocationChange(): ILocation | undefined {
    const {location} = useLocationChangeStore(['location']);
    return location;
}
