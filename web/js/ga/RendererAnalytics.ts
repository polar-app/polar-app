import ua, {EventParams} from 'universal-analytics';
import {Logger} from '../logger/Logger';
import {CIDs} from './CIDs';
import {Version} from '../util/Version';

// const TRACKING_ID = 'UA-122721184-1';
const TRACKING_ID = 'UA-122721184-5';

const DEBUG = false;

const version = Version.get();

declare var window: Window;

const userAgent = window.navigator.userAgent;

const cid = CIDs.get();
const headers = {
};

const visitorOptions: ua.VisitorOptions = {
    cid,
    headers
};

const visitor = ua(TRACKING_ID, visitorOptions).debug(DEBUG);

const log = Logger.create();

const defaultCallback = (err: Error, response: any, body: any) => {

    // The send method take sa callback regarding errors and this allows
    // us to log failure.

    if (err) {
        log.warn("Unable to track analytics: ", err);
    }

};

export class RendererAnalytics {

    public static event(args: IEventArgs): void {

        // TODO: refactor this to and overloaded method I think as if I miss
        // one of the arguments like action and label but give category and
        // value then we don't handle the method call properly.

        // log.debug("Sending analytics event: ", args);

        // FIXME: screenResolution (sr) and viewportSize (vp)
        //
        // https://github.com/peaksandpies/universal-analytics/blob/master/AcceptableParams.md

        const callback = defaultCallback;

        // WARNING: I think enabling version (or 'av') is breaking tracking!
        const eventParams: EventParams = {
            ec: args.category,
            ea: args.action,
            el: args.label,
            ev: args.value,
            // ua: userAgent,
            // av: version
        };

        visitor.event(eventParams).send(callback);

    }

    public static pageviewFromLocation() {

        const url = new URL(document.location!.href);

        const path = url.pathname + url.hash || "";
        const hostname = url.hostname;
        const title = document.title;

        log.info("Created pageview for: ", { path, hostname, title });

        RendererAnalytics.pageview(path, hostname, document.title);

    }

    public static pageview(path: string, hostname?: string, title?: string): void {

        const callback = defaultCallback;

        // WARNING: I think enabling version (or 'av') is breaking tracking!
        const pageviewParams: ua.PageviewParams = {
            dp: path,
            dh: hostname,
            dt: title,
            // ua: userAgent,
            // av: version
        };

        visitor.pageview(pageviewParams).send(callback);

    }

    public static timing(category: string, variable: string, time: string | number): void {
        const callback = defaultCallback;
        visitor.timing(category, variable, time).send(callback);
    }

    public static set(fieldsObject: IFieldsObject): void {

        for (const key of Object.keys(fieldsObject)) {
            const value = fieldsObject[key];
            visitor.set(key, value);
        }

    }

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

