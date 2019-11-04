import {PersistentPrefs} from "../../../../web/js/util/prefs/Prefs";
import {Platforms} from "../../../../web/js/util/Platforms";
import {Dialogs} from "../../../../web/js/ui/dialogs/Dialogs";
import {Logger} from "polar-shared/src/logger/Logger";

const log = Logger.create();

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

        // FIXME: before we are confirmed, we need to first
        //  await the persistent prefs commit after setting the
        // mark

        const writePrefsAndConfirm = async () => {
            prefs.mark(prefKey);
            await prefs.commit();
            onConfirm();
        };

        return this.createDialog(() => {
            writePrefsAndConfirm()
                .catch(err => log.error(err));
        });

    }

    public static createDialog(onConfirm: () => void) {
        Dialogs.confirm({title: 'Premium feature warning',
                         subtitle: "Incremental reading and review on mobile will be come a premium feature and require a paid account and is available now as a preview release.",
                         type: 'warning',
                         onConfirm});
    }

}
