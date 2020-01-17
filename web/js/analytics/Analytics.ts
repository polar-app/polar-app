import {CompositeAnalytics} from "./CompositeAnalytics";
import {IEventArgs, TraitsMap} from "./IAnalytics";
import {GAAnalytics} from "./ga/GAAnalytics";
import {NullAnalytics} from "./null/NullAnalytics";

function isBrowser() {
    return typeof window !== 'undefined';
}

function createDelegate() {

    if (isBrowser()) {
        return new CompositeAnalytics([
            // new SegmentAnalytics(),
            new GAAnalytics()
        ]);
    } else {
        return new NullAnalytics();
    }

}

const delegate = createDelegate();

export class Analytics {

    public static event(event: IEventArgs): void {
        delegate.event(event);
    }

    public static identify(userId: string): void {
        delegate.identify(userId);
    }

    public static page(name: string): void {
        delegate.page(name);
    }

    public static traits(map: TraitsMap): void {
        delegate.traits(map);
    }

}
