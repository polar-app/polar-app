import {SegmentAnalytics} from "./segment/SegmentAnalytics";
import {CompositeAnalytics} from "./CompositeAnalytics";
import {IEventArgs, TraitsMap} from "./IAnalytics";
import {GAAnalytics} from "./ga/GAAnalytics";

export class Analytics {

    private static delegate = new CompositeAnalytics([
        new SegmentAnalytics(),
        new GAAnalytics()
    ]);

    public static event(event: IEventArgs): void {
        this.delegate.event(event);
    }

    public static identify(userId: string): void {
        this.delegate.identify(userId);
    }

    public static page(name: string): void {
        this.delegate.page(name);
    }

    public static traits(map: TraitsMap): void {
        this.delegate.traits(map);
    }

}
