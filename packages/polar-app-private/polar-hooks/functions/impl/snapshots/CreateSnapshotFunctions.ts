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

        const {url} = await UserBackupCreator.create(idUser.uid);

        await Sendgrid.send({
            to: idUser.user.email,
            from: 'noreply@getpolarized.io',
            subject: `Polar data snapshot is ready to download.`,
            html: `<p>Your Polar data snapshot has been created and can be downloaded here:</p><p><a href="${url}">${url}</a></p>`
        })

        return {};

    }

}

export const CreateSnapshotFunction = ExpressFunctions.createRPCHook('CreateSnapshotFunction', CreateSnapshotFunctions.exec);

