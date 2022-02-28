import {URLStr} from "polar-shared/src/util/Strings";

export namespace InviteScreenURLs {

    export interface IInviteScreenURL {
        readonly user_referral_code: string;
    }

    export function parse(url: URLStr): IInviteScreenURL | undefined {
        const regexp = "/invite/([^/]+)$";

        const matches = url.match(regexp);

        if (! matches) {
            return undefined;
        }

        const user_referral_code = matches[1];

        return {user_referral_code};

    }
}
