import * as React from 'react';
import {useHistory} from "react-router-dom";
import {useRefValue} from "../hooks/ReactHooks";
import {BlockNameStr} from "./store/BlocksStore";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {RoutePathNames} from '../apps/repository/RoutePathNames';

export type BlockTargetStr = BlockIDStr | BlockNameStr;

export function useNoteLinkLoader() {

    const history = useHistory();
    const historyRef = useRefValue(history);

    return React.useCallback((target: BlockTargetStr) => {

        console.log("Loading target note: " + target);

        const newURL = RoutePathNames.NOTE(encodeURIComponent(target));
        historyRef.current.push(newURL);

    }, [historyRef]);

}

export function createNoteLink(target: BlockTargetStr) {
    return RoutePathNames.NOTE(target);
}
