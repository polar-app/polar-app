import {IAnalytics, IEventArgs, TraitsMap, IPageEvent, IAnalyticsUser} from "../IAnalytics";
import * as Sentry from '@sentry/browser';

/**
 * https://docs.sentry.io/platforms/javascript/enriching-events/identify-user/
 */
export class SentryAnalytics implements IAnalytics {

    public event(evt: IEventArgs) {
        // noop
    }

    public event2(event: string, data?: any): void {
        // noop
    }

    public page(event: IPageEvent) {
        // noop
    }

    public identify(user: IAnalyticsUser) {
        Sentry.setUser({ email: user.email });
    }

    public traits(traits: TraitsMap) {

    }

    public version(version: string): void {
        // noop
    }

    public heartbeat(): void {
        // noop
    }

    public logout(): void {
        Sentry.configureScope(scope => scope.setUser(null));
    }

}
