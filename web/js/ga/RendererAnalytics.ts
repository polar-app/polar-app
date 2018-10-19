import ua from 'universal-analytics';
import {Logger} from '../logger/Logger';

const TRACKING_ID = 'UA-122721184-1';

const visitor = ua(TRACKING_ID);

const log = Logger.create();

export class RendererAnalytics {

    public static event(args: IEventArgs): void {

        log.debug("Sending analytics event: ", args);

        if(args.label && args.value) {
            visitor.event(args.category, args.action, args.label, args.value).send()
        } else if (args.label) {
            visitor.event(args.category, args.action, args.label).send()
        } else {
            visitor.event(args.category, args.action).send()
        }

    }

    public static pageview(path: string): void {
        visitor.pageview(path).send()
    }

    // public static modalview(name: string, trackerNames?: TrackerNames): void
    // {
        // ReactGA.modalview(name, trackerNames);
        // visitor.
    // }

    public static set(fieldsObject: IFieldsObject): void {

        for (const key in Object.keys(fieldsObject)) {
            const value = fieldsObject[key];
            visitor.set(key, value);
        }

    }

    //
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
