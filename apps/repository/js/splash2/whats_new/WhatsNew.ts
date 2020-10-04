import {LifecycleToggle} from '../../../../../web/js/ui/util/LifecycleToggle';
import {LifecycleEvents} from '../../../../../web/js/ui/util/LifecycleEvents';
import {Version} from 'polar-shared/src/util/Version';
import {Logger} from 'polar-shared/src/logger/Logger';

const log = Logger.create();

export namespace WhatsNew {

    /**
     * Return true if this should be shown under ideal circumstances
     */
    function shouldShow(): boolean {

        const version = Version.get();

        // by default we set the prevVersion to the current version so on the
        // initial install we don't get a whats new dialog box.
        const prevVersion =
            LifecycleToggle.get(LifecycleEvents.WHATS_NEW_VERSION)
                .getOrElse(version);

        log.debug("Comparing versions: ", {version, prevVersion});

        // TODO: this needs semver... from WhatsNewComponent (which is now deprecated)
        return prevVersion !== version;

    }

    export function markShown() {

        const version = Version.get();

        log.debug("Marking version shown: " + version);

        LifecycleToggle.set(LifecycleEvents.WHATS_NEW_VERSION, version);

    }

}
