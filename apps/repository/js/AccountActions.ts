import * as firebase from "../../../web/js/firebase/lib/firebase";
import {Logger} from "polar-shared/src/logger/Logger";
import {PersistenceLayerController} from "../../../web/js/datastore/PersistenceLayerManager";

const log = Logger.create();

export class AccountActions {

    public static logout(persistenceLayerController: PersistenceLayerController) {

        persistenceLayerController.reset();

        firebase.auth().signOut()
            .then(() => {

                window.location.href = '/#logout';
                window.location.reload();

            })
            .catch(err => log.error("Unable to logout: ", err));

    }

}
