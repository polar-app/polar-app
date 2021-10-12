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
import {AppSites} from "../apps/repository/auth_handler/AppSites";


export const useNoteWikiLinkIdentifierCreator = () => {
    const blocksStore = useBlocksStore();

    /**
     * This function is used to get the real anchor of a link by using its label
     *
     * It does the following
     * 1. It looks through the `links` property of the block that has the requested link and extracts it by using its text
     * 2. It gets the ID of the block that the link points to and fetches the block
     * 3. If the fetched block is a named block then we return the name (since it can be used as an anchor in urls)
     * 4. Otherwise it just returns the id of the fetched block (e.g. markdown & image blocks)
     * 5. Edge case: If the block was not found in the links array of the owning block, then the original link text is returned.
     * 
     * @param id The id of the block that owns the link.
     * @param linkText The link's text label.
     *
     */
    return React.useCallback((id: BlockIDStr, linkText: string): string => {
        const block = blocksStore.getBlock(id);

        if (! block) {
            return linkText;
        }
        
        const link = block.content.links.find(({ text }) => {
            return text.startsWith('#')
                ? text.slice(1) === linkText
                : text === linkText
        });

        if (! link) {
            return linkText;
        }

        const targetBlock = blocksStore.getBlock(link.id);

        if (targetBlock && BlockPredicates.isNamedBlock(targetBlock)) {
            return BlockTextContentUtils.getTextContentMarkdown(targetBlock.content);
        }

        return link.id;
    }, [blocksStore]);
};


type IUseLinkNavigationOpts = {
    id: BlockIDStr;
};

interface ILinkNavigationEvent {
    readonly abortEvent: () => void;
    readonly target: EventTarget | null;
}

export const getNoteAnchorFromHref = (href: string): string | null => {

    // e.g. href="#identifier"
    if (href.startsWith('#')) {
        return Arrays.last(href.split('#')) as string;
    }

    const notePathname = RoutePathnames.NOTE("");
    const notesPathname = RoutePathnames.NOTES;

    // e.g. href="/notes/identifier"
    if (href.startsWith(notePathname)) {
        return href.slice(notesPathname.length);
    }

    // A full URL
    if (href.startsWith('http:') || href.startsWith('https:')) {
        const url = new URL(href);
        
        if (! AppSites.isApp(href) || ! url.pathname.startsWith(notePathname)) {
            return null;
        }

        // e.g. href="https://app.getpolarized.io/notes#identifier"
        if (url.pathname.startsWith(notesPathname) && url.hash.length > 0) {
            return url.hash.slice(1);
        }

        // e.g. href="https://app.getpolarized.io/notes/identifier"
        return href.slice(notePathname.length);
    }

    return null;
};

function useLinkNavigationEventListener({ id }: IUseLinkNavigationOpts) {

    const linkLoaderRef = useLinkLoaderRef();
    const noteLinkLoader = useNoteLinkLoader();
    const noteWikiLinkCreator = useNoteWikiLinkIdentifierCreator();
    const history = useHistory();

    return React.useCallback((event: ILinkNavigationEvent): boolean => {

        const {target, abortEvent} = event;

        if (! (target instanceof HTMLAnchorElement)) {
            return false;
        }


        const href = target.getAttribute('href');

        if (href === null || href === '#' || href === '') {
            return false;
        }

        const anchor = getNoteAnchorFromHref(href);

        if (anchor) {
            const link = noteWikiLinkCreator(id, anchor);
            noteLinkLoader(link);

            abortEvent();
            return true;
        } else {
            linkLoaderRef.current(href, {newWindow: true, focus: true});
            abortEvent();
            return true;

        }

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
