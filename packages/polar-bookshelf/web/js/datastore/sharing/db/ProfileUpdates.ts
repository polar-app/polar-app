import {JSONRPC} from '../rpc/JSONRPC';
import {IProfileInit} from "packages/polar-app-public/polar-firebase/src/firebase/om/ProfileCollection";

export class ProfileUpdates {

    public static async exec(request: ProfileUpdateRequest) {
        await JSONRPC.exec('profileUpdate', request);
    }

}

export interface ProfileUpdateRequest extends IProfileInit {

}
