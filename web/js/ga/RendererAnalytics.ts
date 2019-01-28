import ua from 'universal-analytics';
import {Logger} from '../logger/Logger';

const TRACKING_ID = 'UA-122721184-1';

const visitor = ua(TRACKING_ID);

const log = Logger.create();

export class RendererAnalytics {

    public static event(args: IEventArgs): void {

        // TODO: refactor this to and overloaded method I think as if I miss
        // one of the arguments like action and label but give category and
        // value then we don't handle the method call properly.

        log.debug("Sending analytics event: ", args);

        const callback = (err: Error) => {

            // The send method take sa callback regarding errors and this allows
            // us to log failure.

            if (err) {
                log.warn("Unable to track analytics: ", err);
            }

        };

        if (args.label && args.value) {
            visitor.event(args.category, args.action, args.label, args.value).send(callback);
        } else if (args.label) {
            visitor.event(args.category, args.action, args.label).send(callback);
        } else {
            visitor.event(args.category, args.action).send(callback);
        }

    }

    public static pageview(path: string, hostname?: string, title?: string): void {

        if (hostname && title) {
            visitor.pageview(path, hostname, title).send();
        } else {
            visitor.pageview(path).send();
        }

    }

    // public static modalview(name: string, trackerNames?: TrackerNames): void
    // {
        // ReactGA.modalview(name, trackerNames);
        // visitor.
    // }

    public static set(fieldsObject: IFieldsObject): void {

        for (const key of Object.keys(fieldsObject)) {
            const value = fieldsObject[key];
            visitor.set(key, value);
        }

    }

    // public static outboundLink(args: OutboundLinkArgs, hitCallback?: () =>
    // void, trackerNames?: TrackerNames): void {  if (!hitCallback) { //
    // noinspection TsLint hitCallback = () => {}; }
    // ReactGA.outboundLink(args, hitCallback, trackerNames);  }

}

export interface IEventArgs {
    category: string;
    action: string;
    label?: string;
    value?: number;
    nonInteraction?: boolean;
    transport?: string;
}

export interface IFieldsObject {
    [i: string]: any;
}
