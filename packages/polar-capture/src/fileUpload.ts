import { FirebaseAdmin } from "polar-firebase-admin/src/FirebaseAdmin";
import { Datastores } from "polar-hooks/functions/impl/datastore/Datastores";

export namespace fileUpload {

    function init() {
        const project = Datastores.createStorage().config.project;

        const bucketName = `gs://${project}.appspot.com`;

        const bucketRef = FirebaseAdmin.createApp().storage().bucket(bucketName);

        return bucketRef;
    }
}