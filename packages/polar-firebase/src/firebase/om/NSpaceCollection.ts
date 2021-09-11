import {IDStr} from "polar-shared/src/util/Strings";
import {SlugIntlStr} from "polar-shared/src/util/Slugs";
import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {Collections} from "polar-firestore-like/src/Collections";
import {IWriteBatch} from "polar-firestore-like/src/IWriteBatch";

export namespace NSpaceCollection {

    export type LangStr = string;
    export type NSpaceName = string;

    export interface INSpaceInit {

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

        /**
         * The computed internationalized slug.
         */
        readonly slug: SlugIntlStr;

    }

    export const COLLECTION = 'nspace';

    export async function get(firestore: IFirestore<unknown>, id: IDStr): Promise<INSpace | undefined> {
        return await Collections.get(firestore, COLLECTION, id);
    }

    export async function set(firestore: IFirestore<unknown>, nspace: INSpace, batch?: IWriteBatch<unknown>) {
        return await Collections.set(firestore, COLLECTION, nspace.id, nspace, batch);
    }

}
