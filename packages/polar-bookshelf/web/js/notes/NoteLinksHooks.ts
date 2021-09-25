import React from "react";
import {useNoteLinkLoader} from "./NoteLinkLoader";
import {useLinkLoaderRef} from "../ui/util/LinkLoaderHook";
import {useHistory} from "react-router";
import {Arrays} from "polar-shared/src/util/Arrays";
import {BlockPredicates} from "./store/BlockPredicates";
import {RoutePathnames} from "../apps/repository/RoutePathnames";
import {useBlocksStore} from "./store/BlocksStore";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {BlockTextContentUtils} from "./NoteUtils";

export const useNoteWikiLinkCreator = () => {
    const blocksStore = useBlocksStore();

    return React.useCallback((id: BlockIDStr, linkText: string): string | null => {
        const block = blocksStore.getBlock(id);

        if (! block || block.content.type !== "markdown") {
            return null;
        }
        
        const link = block.content.links.find(({ text }) => text === linkText);

        if (! link) {
            return null;
        }

        const targetBlock = blocksStore.getBlock(link.id);

        if (targetBlock && BlockPredicates.isNamedBlock(targetBlock)) {
            return BlockTextContentUtils.getTextContentMarkdown(targetBlock.content);
        }

        return null;
    }, [blocksStore]);
};


type IUseLinkNavigationOpts = {
    id: BlockIDStr;
};

interface ILinkNavigationEvent {
    readonly abortEvent: () => void;
    readonly target: EventTarget | null;
}

function useLinkNavigationEventListener({ id }: IUseLinkNavigationOpts) {

    const linkLoaderRef = useLinkLoaderRef();
    const noteLinkLoader = useNoteLinkLoader();
    const noteWikiLinkCreator = useNoteWikiLinkCreator();
    const history = useHistory();

    return React.useCallback((event: ILinkNavigationEvent): boolean => {

        const {target, abortEvent} = event;

        if (target instanceof HTMLAnchorElement) {

            const href = target.getAttribute('href');

            if (href !== null) {

                if (href.startsWith('#')) {

                    const anchor = Arrays.last(href.split("#"));

                    if (anchor) {
                        const link = noteWikiLinkCreator(id, anchor);
                        if (link) {
                            noteLinkLoader(link);
                        } else {
                            noteLinkLoader(anchor);
                        }
                        abortEvent();
                        return true;
                    }

                } else {
                    if (href.startsWith(RoutePathnames.NOTE(""))) {
                        history.push(href);
                    } else {
                        const linkLoader = linkLoaderRef.current;
                        linkLoader(href, {newWindow: true, focus: true});
                    }
                    abortEvent();
                    return true;

                }

            }

        }

        return false;

    }, [noteWikiLinkCreator, linkLoaderRef, noteLinkLoader, history, id]);

}

export function useLinkNavigationClickHandler({ id }: IUseLinkNavigationOpts) {

    const linkNavigationEventListener = useLinkNavigationEventListener({ id });

    return React.useCallback((event: React.MouseEvent) => {

        function abortEvent() {
            event.stopPropagation();
            event.preventDefault();
        }

        const target = event.target;

        return linkNavigationEventListener({target, abortEvent});

    }, [linkNavigationEventListener]);

}
