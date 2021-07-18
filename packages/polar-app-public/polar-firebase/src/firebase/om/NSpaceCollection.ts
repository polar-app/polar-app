import {IDStr} from "polar-shared/src/util/Strings";
import {EPUBGenerator} from "polar-epub-generator/src/EPUBGenerator";
import {SlugIntlStr} from "polar-shared/src/util/Slugs";

export namespace NSpaceCollection {

    import LangStr = EPUBGenerator.LangStr;
    export type NSpaceName = string;

    export interface INSpace {

        /**
         * A unique ID / hashcode for this namespace. We use a random ID here
         */
        readonly id: IDStr;

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

}
