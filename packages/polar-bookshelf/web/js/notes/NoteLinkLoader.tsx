import * as React from 'react';
import {useHistory} from "react-router-dom";
import {useRefValue} from "../hooks/ReactHooks";
import {BlockNameStr} from "./store/BlocksStore";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {RoutePathnames} from '../apps/repository/RoutePathnames';

export type BlockTargetStr = BlockIDStr | BlockNameStr;

export function useNoteLinkLoader() {

    const history = useHistory();
    const historyRef = useRefValue(history);

    return React.useCallback((target: BlockTargetStr) => {

        const newURL = RoutePathnames.NOTE(encodeURIComponent(target));
        historyRef.current.push(newURL);

    }, [historyRef]);

}

export function createNoteLink(target: BlockTargetStr) {
    return RoutePathnames.NOTE(target);
}
