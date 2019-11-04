import {PersistentPrefs} from "../../../../web/js/util/prefs/Prefs";
import {Platforms} from "../../../../web/js/util/Platforms";
import {Dialogs} from "../../../../web/js/ui/dialogs/Dialogs";

export class PreviewWarnings {

    public static async doWarning(prefs: PersistentPrefs,
                                  onConfirm: () => void) {

        if (! Platforms.isMobile()) {
            // we only need this on mobile platforms.
            return onConfirm();
        }

        const prefKey = 'reviewer-mobile-preview-warning';

        const marked = prefs.isMarked(prefKey);

        if (marked) {
            // the user has already been given this warning.
            return onConfirm();
        }

        return this.createDialog(onConfirm);

    }

    public static createDialog(onConfirm: () => void) {
        Dialogs.confirm({title: 'Premium feature warning',
                         subtitle: "Incremental reading and review on mobile will be come a premium feature and require a paid account and is available now as a preview release.",
                         type: 'warning',
                         onConfirm});
    }

}
