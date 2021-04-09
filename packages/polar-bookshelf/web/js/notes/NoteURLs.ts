import {Arrays} from "polar-shared/src/util/Arrays";
import {NoteTargetStr} from "./NoteLinkLoader";
import {BlockIDStr} from "./store/BlocksStore";

export interface INoteURL {

    /**
     * The ID or node name as a target.
     */
    readonly target: BlockIDStr | NoteTargetStr;

}

export namespace NoteURLs {

    export function parse(url: string): INoteURL | undefined {

        const target = Arrays.last(url.split('/'));

        if (target) {
            return {target};
        } else {
            return undefined;
        }

    }

}
