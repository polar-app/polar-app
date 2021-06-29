import {JSONRPC} from '../rpc/JSONRPC';
import {IProfileInit} from "polar-firebase/src/firebase/om/Profiles";

export class ProfileUpdates {

    public static async exec(request: ProfileUpdateRequest) {
        await JSONRPC.exec('profileUpdate', request);
    }

}

export interface ProfileUpdateRequest extends IProfileInit {

}
