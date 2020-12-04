import {Arrays} from "polar-shared/src/util/Arrays";

export interface INoteURL {

    /**
     * The ID or node name.
     */
    readonly id: string;

}

export namespace NoteURLs {

    export function parse(url: string): INoteURL | undefined {

        const id = Arrays.last(url.split('/'));

        if (id) {
            return {id};
        } else {
            return undefined;
        }

    }

}