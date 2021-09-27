import {IDUser} from '../util/IDUsers';
import {UserBackupCreator} from "./UserBackupCreator";
import {Sendgrid} from "../Sendgrid";
import {ExpressFunctions} from "../util/ExpressFunctions";

export interface CreateSnapshotRequest {

}

export interface CreateSnapshotResponse {

}

class CreateSnapshotFunctions {

    public static async exec(idUser: IDUser,
                             request: CreateSnapshotRequest): Promise<CreateSnapshotResponse> {

        const to = idUser.user.email;
        const from = 'noreply@getpolarized.io';

        await Sendgrid.send({
            to,
            from,
            subject: `Polar data snapshot is being prepared.`,
            html: `<p>Your Polar data snapshot is being prepared. You should receive another email in a few moments.</a></p>`
        })

        const {url} = await UserBackupCreator.create(idUser.uid);

        await Sendgrid.send({
            to,
            from,
            subject: `Polar data snapshot is ready to download.`,
            html: `<p>Your Polar data snapshot has been created and can be downloaded here:</p><p><a href="${url}">${url}</a></p>`
        })

        return {};

    }

}

export const CreateSnapshotFunction = ExpressFunctions.createRPCHook('CreateSnapshotFunction', CreateSnapshotFunctions.exec);

