import {useHistory, useLocation} from "react-router-dom";
import React from "react";

export type Activator = (active: boolean) => void;

export type UseStateFromHistoryHashResult = readonly [boolean, Activator];

export function useStateFromHistoryHash(id: string,
                                        defaultActive: boolean = false): UseStateFromHistoryHashResult {

    const history = useHistory();
    const location = useLocation();

    const hash = React.useMemo(() => `#${id}${Date.now()}`, [id]);

    const [active, setActive] = React.useState(defaultActive);

    const activator = React.useCallback((active: boolean) => {

        if (active) {
            // the activator just pushes this onto the history and our useEffect
            // will handle activation.
            history.push({hash});
        } else {
            history.push({hash: ''})
        }

    }, [hash, history]);

    React.useEffect(() => {

        if (location.hash === hash && ! active) {
            // we just changed from active to inactive
            setActive(true);
        }

        if (location.hash !== hash && active){
            setActive(false);
        }

    }, [location.hash, hash, active]);

    return [active, activator];

}
