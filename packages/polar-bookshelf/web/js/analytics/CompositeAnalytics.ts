import {IAnalytics, IAnalyticsUser, IEventArgs, IPageEvent, TraitsMap} from "./IAnalytics";

export class CompositeAnalytics implements IAnalytics {

    constructor (private readonly delegates: ReadonlyArray<IAnalytics>) {

    }

    public event(event: IEventArgs): void {
        this.invoke(delegate => delegate.event(event));
    }

    public event2(event: string, data?: any): void {
        this.invoke(delegate => delegate.event2(event, data));
    }

    public identify(user: IAnalyticsUser): void {
        this.invoke(delegate => delegate.identify(user));
    }

    public page(event: IPageEvent): void {
        this.invoke(delegate => delegate.page(event));
    }

    public traits(map: TraitsMap): void {
        this.invoke(delegate => delegate.traits(map));
    }
    public version(version: string): void {
        this.invoke(delegate => delegate.version(version));
    }

    public heartbeat(): void {
        this.invoke(delegate => delegate.heartbeat());
    }

    public logout(): void {
        this.invoke(delegate => delegate.logout());
    }

    private invoke(handler: (delegate: IAnalytics) => void) {

        for (const delegate of this.delegates) {
            try {
                handler(delegate);
            } catch (e) {
                console.error(e);
            }
        }

    }

}
