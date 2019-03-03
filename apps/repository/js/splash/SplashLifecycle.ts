import {LocalPrefs} from '../../../../web/js/ui/util/LocalPrefs';

export class SplashLifecycle {

    private static KEY = 'splash-shown';
    private static DELAY = '1d';

    public static canShow(): boolean {

        if (! navigator.onLine) {
            // almost all the splashes (possibly all of them) require the user
            // to be online.
            return false;
        }

        return ! LocalPrefs.isDelayed(SplashLifecycle.KEY, SplashLifecycle.DELAY);

    }

    public static markShown() {
        LocalPrefs.markDelayed(this.KEY, SplashLifecycle.DELAY);
    }

}
