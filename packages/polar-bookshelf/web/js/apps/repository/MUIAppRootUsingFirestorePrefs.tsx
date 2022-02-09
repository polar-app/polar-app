import * as React from "react";
import {useFirestorePrefs} from "../../../../apps/repository/js/persistence_layer/FirestorePrefs";
import {useFeatureEnabled} from "../../features/FeaturesRegistry";
import {MUIAppRoot} from "../../mui/MUIAppRoot";

interface IProps {
    readonly children: React.ReactNode;
}

export const MUIAppRootUsingFirestorePrefs = React.memo(function MUIAppRootUsingFirestorePrefs(props: IProps) {

    const firestorePrefs = useFirestorePrefs();

    const darkMode = React.useMemo(() => firestorePrefs.get('dark-mode').getOrElse('true') === 'true', [firestorePrefs]);

    // whether we should use the new design...
    const useRedesign = useFeatureEnabled('use-redesign-theme');

    return (
        <MUIAppRoot useRedesign={useRedesign} darkMode={darkMode}>
            {props.children}
        </MUIAppRoot>
    );

});

