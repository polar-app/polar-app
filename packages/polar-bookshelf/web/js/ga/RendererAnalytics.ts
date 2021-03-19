import ua, {EventParams} from 'universal-analytics';
import {Logger} from 'polar-shared/src/logger/Logger';
import {CIDs} from './CIDs';
import {Stopwatch, TrackedDuration} from 'polar-shared/src/util/Stopwatch';
import {Stopwatches} from 'polar-shared/src/util/Stopwatches';
import {DurationMS} from 'polar-shared/src/util/TimeDurations';
import {Analytics} from "../analytics/Analytics";

const TRACKING_ID = 'UA-122721184-5';

const DEBUG = false;

declare var window: Window;

const isBrowserContext = typeof window !== 'undefined';
const cid =  isBrowserContext ? CIDs.get() : 'none';

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

        if (! isBrowserContext) {
            // log.warn("Not called from browser context");
            return;
        }

        // TODO: refactor this to and overloaded method I think as if I miss
        // one of the arguments like action and label but give category and
        // value then we don't handle the method call properly.

        // log.debug("Sending analytics event: ", args);

        // TODO: screenResolution (sr) and viewportSize (vp)
        //
        // https://github.com/peaksandpies/universal-analytics/blob/master/AcceptableParams.md

        const callback = defaultCallback;

        // WARNING: I think enabling version (or 'av') is breaking tracking!
        const eventParams: EventParams = {
            ec: args.category,
            ea: args.action,
            // ua: userAgent,
            // av: version
        };

        visitor.event(eventParams).send(callback);

    }

    /**
     * https://support.google.com/analytics/answer/3123666?hl=en
     *
     * https://support.google.com/analytics/answer/3123662?hl=en&utm_id=ad
     *
     * You must make sure you have the full rights to use this service, to upload data, and to use it with your Google
     * Analytics account.
     *
     * You will give your end users proper notice about the implementations and features of Google Analytics you use
     * (e.g. notice about what data you will collect via Google Analytics, and whether this data can be connected to
     * other data you have about the end user). You will either get consent from your end users, or provide them with
     * the opportunity to opt-out from the implementations and features you use.
     *
     * You will not upload any data that allows Google to personally identify an individual (such as certain names,
     * social security numbers, email addresses, or any similar data), or data that permanently identifies a particular
     * device (such as a mobile phone’s unique device identifier if such an identifier cannot be reset).
     *
     * If you upload any data that allows Google to personally identify an individual, your Google Analytics account can
     * be terminated, and you may lose your Google Analytics data.
     *
     * You will only session stitch authenticated and unauthenticated sessions of your end users if your end users have
     * given consent to such stitch, or if such merger is allowed under applicable laws and regulations.
     *
     * ga('set', 'userId', 'USER_ID');
     *
     * Set the user ID using signed-in user_id.
     *
     */
    public static identify(uid: string) {
        visitor.set('userId', uid);
    }

    public static pageview(path: string, hostname?: string, title?: string): void {

        if (! isBrowserContext) {
            log.warn("Not called from browser context");
            return;
        }

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

        if (! isBrowserContext) {
            log.warn("Not called from browser context");
            return;
        }

        const callback = defaultCallback;
        visitor.timing(category, variable, time).send(callback);
    }

    public static createTimer(category: string, variable: string): Timer {
        // TODO: consider refactoring this to include some data about the
        // runtime including the device type (mobile vs desktop),
        // the network type (3g vs 4g), etc.  If this system supported tags
        // that would definitely improve things.
        //
        // major tags should include:
        //
        // network (3g, 4g, etc)
        // device type (mobile|desktop)
        // OS (macos, windows, linux, android)
        // browser (electron, chrome, firefox, etc)

        return new DefaultTimer(category, variable);
    }

    /**
     * Perform the operation with a timer to record the duration.
     */
    public static withTimer<T>(category: string, variable: string, closure: () => T ): T {

        const stopwatch = this.createTimer(category, variable);

        try {

            const result = closure();
            return result;

        } finally {
            stopwatch.stop();
        }


    }

    /**
     * Perform the operation with a stopwatch to record the duration.
     */
    public static async withTimerAsync<T>(category: string, variable: string, closure: () => Promise<T> ): Promise<T> {

        const stopwatch = this.createTimer(category, variable);

        try {

            const result = await closure();
            return result;

        } finally {
            stopwatch.stop();
        }

    }

    public static createTracer(category: string): Tracer {
        return new DefaultTracer(category);
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
}

export interface IFieldsObject {
    [i: string]: any;
}

export interface Timer {

    /**
     * Stop the timer and record the amount of time it took to perform the
     * operation.
     */
    stop(): void;

}

class LogThresholds {

    public static readonly info = 500;

    public static readonly warn = 750;

    public static readonly error = 1500;

}

class DefaultTimer implements Timer {

    private stopped: boolean = false;

    constructor(private readonly category: string,
                private readonly variable: string,
                private readonly stopwatch: Stopwatch = Stopwatches.create()) {

    }

    public stop() {

        if (this.stopped) {
            log.warn("Stop called twice");
            // only allow this to be stopped once as a bug with subsequent
            // stop calls would yield incorrect metrics.
            return;
        }

        const duration = this.stopwatch.stop();

        this.doAnalytics(duration);
        this.doLogging(duration);

        this.stopped = true;

    }

    private doAnalytics(duration: TrackedDuration) {
        if (navigator.onLine) {
            RendererAnalytics.timing(this.category, this.variable, duration.durationMS);
        }
    }

    private doLogging(duration: TrackedDuration) {

        type ThresholdLevel = 'error' | 'warn' | 'info';

        const toLevel = (duration: DurationMS): ThresholdLevel | undefined => {

            if (duration > LogThresholds.error) {
                return 'error';
            } else if (duration > LogThresholds.warn) {
                return 'warn';
            } else if (duration > LogThresholds.info) {
                return 'info';
            }

            return undefined;

        };

        // const level = toLevel(duration.durationMS);
        //
        // const durationMS = `${duration.durationMS}ms`;
        //
        // const message = `Operation took too long: ${this.category}:${this.variable}:`;
        //
        // // we have to log directly to the console here as logging normally would
        // // generate other types of events that we don't want to trigger.
        // switch (level) {
        //
        //     case 'info':
        //         console.info(message, durationMS);
        //         break;
        //
        //     case 'warn':
        //         console.warn(message, durationMS);
        //         break;
        //
        //     case 'error':
        //         console.error(message, durationMS);
        //         break;
        //
        // }

    }


}

/**
 * Tracer object which is similar than using a timer since we don't constantly
 * specify a category.
 */
export interface Tracer {

    trace<T>(variable: string, closure: () => T ): T;

    traceAsync<T>(variable: string, closure: () => Promise<T> ): Promise<T>;

}

class DefaultTracer implements Tracer {

    constructor(private readonly category: string) {

    }

    public trace<T>(variable: string, closure: () => T ): T {
        return RendererAnalytics.withTimer(this.category, variable, closure);
    }

    public async traceAsync<T>(variable: string, closure: () => Promise<T> ): Promise<T> {
        return await RendererAnalytics.withTimerAsync(this.category, variable, closure);
    }

}

export class NullTracer implements Tracer {

    public trace<T>(variable: string, closure: () => T): T {
        return closure();
    }

    public async traceAsync<T>(variable: string, closure: () => Promise<T>): Promise<T> {
        return await closure();
    }

}
