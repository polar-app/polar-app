import {usePersistenceContext} from "../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {AccountActions} from "./AccountActions";
import { useHistory } from "react-router-dom";

export function useLogoutCallback() {

    const persistenceContext = usePersistenceContext();

    return () => {
        AccountActions.logout(persistenceContext.persistenceLayerManager);
    };

}

export function useLoginCallback() {

    const history = useHistory()

    return () => {
        history.replace('/login');
    }

}
