import {Strings} from "./Strings";

export namespace Challenges {

    interface IChallengeWithParts {
        readonly p0: string;
        readonly p1: string;
        readonly challenge: string;
    }

    export function create(): IChallengeWithParts {

        const n0 = Math.floor(Math.random() * 999);
        const n1 = Math.floor(Math.random() * 999);

        const p0 = Strings.lpad(n0, '0', 3);
        const p1 = Strings.lpad(n1, '0', 3);

        const challenge = p0 + p1;
        return {challenge, p0, p1};
    }

}
