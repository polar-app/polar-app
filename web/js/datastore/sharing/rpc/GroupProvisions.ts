import {GroupInit} from '../db/Groups';
import {JSONRPC} from './JSONRPC';
import {DocRef} from '../db/DocRefs';

export class GroupProvisions {

    public static async exec(request: GroupProvisionRequest): Promise<GroupProvisionResponse> {
        return await JSONRPC.exec('groupProvision', request);
    }

}


export interface GroupProvisionRequest extends GroupInit {

    /**
     * Used when we're provisioning a group with an initial set of documents.
     */
    readonly docs: ReadonlyArray<DocRef>;

    /**
     * Invite the users in this set of invitations to a group of users.
     */
    readonly invitations: Invitations;

}

export interface GroupProvisionResponse {

    /**
     * The ID fo the group that was provisioned.
     */
    readonly id: string;

    /**
     * When using a custom group with a custom name.
     */
    readonly name?: string;

}

interface Invitations {

    readonly message: string;

    readonly to: ReadonlyArray<EmailStr>;

}

export type DocIDStr = string;

export type EmailStr = string;
