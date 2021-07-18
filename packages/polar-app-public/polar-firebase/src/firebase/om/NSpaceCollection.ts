import {IDStr} from "polar-shared/src/util/Strings";
import {EPUBGenerator} from "polar-epub-generator/src/EPUBGenerator";
import {SlugIntlStr} from "polar-shared/src/util/Slugs";
import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {Collections} from "polar-firestore-like/src/Collections";

export namespace NSpaceCollection {

    import LangStr = EPUBGenerator.LangStr;
    export type NSpaceName = string;

    export interface INSpaceInit {

        /**
         * The computed internationalized slug.
         */
        readonly slug: SlugIntlStr;

        /**
         * The name for this slug.
         */
        readonly name: string;

        readonly description: string;

        /**
         * The primary lang for this namespace.
         */
        readonly lang: LangStr | undefined;

        /**
         * All the langs for this namespace.
         */
        readonly langs: ReadonlyArray<LangStr> | undefined;

    }

    export interface INSpace extends INSpaceInit {

        /**
         * A unique ID / hashcode for this namespace. We use a random ID here
         */
        readonly id: IDStr;

    }

    export const COLLECTION = 'nspace';

    export async function get(firestore: IFirestore<unknown>, id: IDStr): Promise<INSpace | undefined> {
        return await Collections.get(firestore, COLLECTION, id);
    }

    export async function set(firestore: IFirestore<unknown>, nspace: INSpace) {
        return await Collections.set(firestore, COLLECTION, nspace.id, nspace);
    }

}
