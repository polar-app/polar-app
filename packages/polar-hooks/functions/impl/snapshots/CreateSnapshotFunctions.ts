import {IDUser} from '../util/IDUsers';
import {UserBackupCreator} from "./UserBackupCreator";
import {Sendgrid} from "../Sendgrid";
import {ExpressFunctions} from "../util/ExpressFunctions";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CreateSnapshotRequest {

}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CreateSnapshotResponse {

}

class CreateSnapshotFunctions {

    public static async exec(idUser: IDUser,
                             request: CreateSnapshotRequest): Promise<CreateSnapshotResponse> {

        const to = iduser.user.email;
        const from = 'noreply@getpolarized.io';

        await sendgrid.send({
            to,
            from,
            subject: `polar data snapshot is being prepared.`,
            html: `<p>your polar data snapshot is being prepared. you should receive another email in a few moments.</a></p>`
        })

        const {url} = await userbackupcreator.create(iduser.uid);

        await sendgrid.send({
            to,
            from,
            subject: `polar data snapshot is ready to download.`,
            html: `<p>your polar data snapshot has been created and can be downloaded here:</p><p><a href="${url}">${url}</a></p>`
        })

        return {};

    }

}

export const CreateSnapshotFunction = ExpressFunctions.createRPCHook('CreateSnapshotFunction', CreateSnapshotFunctions.exec);

