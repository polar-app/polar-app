import {JSONRPC} from '../rpc/JSONRPC';
import {ProfileInit} from "polar-firebase/src/firebase/om/Profiles";

export class ProfileUpdates {

    public static async exec(request: ProfileUpdateRequest) {
        await JSONRPC.exec('profileUpdate', request);
    }

}

export interface ProfileUpdateRequest extends ProfileInit {

}
