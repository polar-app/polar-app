import * as React from 'react';
import {useHistory} from "react-router-dom";
import {useRefValue} from "../hooks/ReactHooks";
import {BlockNameStr, useBlocksStore} from "./store/BlocksStore";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {RoutePathNames} from '../apps/repository/RoutePathNames';
import {BlockPredicates} from "./store/BlockPredicates";
import {BlockTextContentUtils} from "./BlockTextContentUtils";

export type BlockTargetStr = BlockIDStr | BlockNameStr;

export function useNoteLinkLoader() {

    const history = useHistory();
    const blocksStore = useBlocksStore();
    const historyRef = useRefValue(history);

    const doLoadTarget = React.useCallback((target: BlockTargetStr) => {

        const newURL = RoutePathNames.NOTE(encodeURIComponent(target));

        if (historyRef.current.location.pathname === newURL) {
            // already loaded...
            return;
        }

        historyRef.current.push(newURL);

    }, [historyRef]);

    return React.useCallback((target: BlockTargetStr) => {

        console.log("Loading target note: " + target);

        const block = blocksStore.getBlock(target);

        if (block && block.id === block.root && BlockPredicates.isNamedBlock(block)) {
            doLoadTarget(BlockTextContentUtils.getTextContentMarkdown(block.content));
        } else {
            doLoadTarget(target);
        }

    }, [doLoadTarget, blocksStore]);

}

export function createNoteLink(target: BlockTargetStr) {
    return RoutePathNames.NOTE(target);
}
