import {Arrays} from "polar-shared/src/util/Arrays";
import {BlockTargetStr} from "./NoteLinkLoader";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";

export interface INoteURL {

    /**
     * The ID or node name as a target.
     */
    readonly target: BlockIDStr | BlockTargetStr;

}

export namespace NoteURLs {

    export function parse(url: string): INoteURL | undefined {

        const target = Arrays.last(url.split('/'));

        if (target) {
            return {target: decodeURIComponent(target)};
        } else {
            return undefined;
        }

    }

}
