import {IAnalytics, IEventArgs, TraitsMap} from "./IAnalytics";

export class CompositeAnalytics implements IAnalytics {

    constructor (private readonly delegates: ReadonlyArray<IAnalytics>) {

    }

    public event(event: IEventArgs): void {
        this.invoke(delegate => delegate.event(event));
    }

    public event2(event: string, data?: any): void {
        this.invoke(delegate => delegate.event2(event, data));
    }

    public identify(userId: string): void {
        this.invoke(delegate => delegate.identify(userId));
    }

    public page(name: string): void {
        this.invoke(delegate => delegate.page(name));
    }

    public traits(map: TraitsMap): void {
        this.invoke(delegate => delegate.traits(map));
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
