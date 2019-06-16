import {ProfileInit} from './Profiles';
import {JSONRPC} from './JSONRPC';

export class ProfileUpdates {

    public static async exec(request: ProfileUpdateRequest) {
        await JSONRPC.exec('profileUpdate', request);
    }

}

interface ProfileUpdateRequest extends ProfileInit {

    readonly idToken: string;

}
