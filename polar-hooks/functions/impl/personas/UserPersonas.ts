import { Arrays } from "polar-shared/src/util/Arrays";

export namespace UserPersonas {

    export interface IUserRecord {
        readonly uid: string;
        readonly email?: string;
        readonly displayName?: string;
    }

    export interface ICreateOpts {
        readonly email?: string;
        readonly displayName?: string;
    }

    export interface IUserPersona {
        readonly email: string;
        readonly firstName: string | undefined;
    }

    export function create(opts: ICreateOpts): IUserPersona | undefined {

        if (! opts.email) {
            return undefined;
        }

        const firstName = computeFirstName(opts.displayName);

        return {
            email: opts.email,
            firstName,
        };

    }

    function computeFirstName(displayName: string | undefined) {

        if (displayName === undefined) {
            return undefined;
        }

        const split = displayName!.split(" ");

        return Arrays.first(split);

    }

}