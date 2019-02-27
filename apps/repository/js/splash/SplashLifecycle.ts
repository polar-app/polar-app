import {LocalPrefs} from '../../../../web/js/ui/util/LocalPrefs';

export class SplashLifecycle {

    private static KEY = 'splash-shown';
    private static DELAY = '1d';

    public static canShow(): boolean {

        if (! LocalPrefs.get(SplashLifecycle.KEY).isPresent()) {
            // require the delay on first startup so not to annoy people with
            // too many splashes on the first startup.
            this.markShown();
            return false;
        }

        return LocalPrefs.isDelayed(SplashLifecycle.KEY, SplashLifecycle.DELAY);

    }

    public static markShown() {
        LocalPrefs.markDelayed(this.KEY, SplashLifecycle.DELAY);
    }

}
