import {LifecycleEvents} from '../../../../../web/js/ui/util/LifecycleEvents';
import {Version} from 'polar-shared/src/util/Version';
import {LocalPrefs} from "../../../../../web/js/util/LocalPrefs";

export namespace WhatsNew {

    /**
     * Return true if this should be shown under ideal circumstances
     */
    function shouldShow(): boolean {

        const version = Version.get();

        // by default we set the prevVersion to the current version so on the
        // initial install we don't get a whats new dialog box.
        const prevVersion =
            LocalPrefs.get(LifecycleEvents.WHATS_NEW_VERSION)
                .getOrElse(version);

        console.debug("Comparing versions: ", {version, prevVersion});

        // TODO: this needs semver... from WhatsNewComponent (which is now deprecated)
        return prevVersion !== version;

    }

    export function markShown() {

        const version = Version.get();

        console.debug("Marking version shown: " + version);

        LocalPrefs.set(LifecycleEvents.WHATS_NEW_VERSION, version);

    }

}
