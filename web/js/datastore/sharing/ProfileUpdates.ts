import {ProfileInit} from './Profiles';
import {JSONRPC} from './JSONRPC';
import {UserRequest} from './UserRequest';

export class ProfileUpdates {

    public static async exec(request: UserRequest<ProfileUpdateRequest>) {
        await JSONRPC.exec('profileUpdate', request);
    }

}

export interface ProfileUpdateRequest extends ProfileInit {

}
