import * as React from 'react';
import {useDialogManager} from "../../mui/dialogs/MUIDialogControllers";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {usePrefsContext} from "../../../../apps/repository/js/persistence_layer/PrefsContext2";
import {IDStr} from "polar-shared/src/util/Strings";

/**
 * Allows us to have a 'gateway' to show a user a dialog but only the first time
 * they trigger a function and 'accept' what we're telling them.
 */
export interface FeatureGatewayDialogOpts {

    /**
     * The name of the pref to use to see if we have already used this feature.
     */
    readonly pref: IDStr;
    readonly title: string;
    readonly body: string | JSX.Element;
    readonly delegate: () => void;

}

export function useFeatureGatewayDialog(opts: FeatureGatewayDialogOpts) {

    const dialogs = useDialogManager();
    const prefs = usePrefsContext();

    return React.useCallback(() => {

        opts.delegate();

        if (! prefs.isMarked(opts.pref)) {

            prefs.mark(opts.pref);

            prefs.commit()
                .catch(err => console.error("Unable to commit prefs: ", err));

            dialogs.confirm({
                title: opts.title,
                subtitle: opts.body,
                type: 'primary',
                noCancel: true,
                maxWidth: 'lg',
                acceptText: "OK",
                onAccept: NULL_FUNCTION,
            });

        }

    }, [dialogs, opts, prefs])

}
