import {Stopwatch, TrackedDuration} from 'polar-shared/src/util/Stopwatch';
import {Stopwatches} from 'polar-shared/src/util/Stopwatches';
import {DurationMS} from 'polar-shared/src/util/TimeDurations';

export class RendererAnalytics {

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
            console.warn("Stop called twice");
            // only allow this to be stopped once as a bug with subsequent
            // stop calls would yield incorrect metrics.
            return;
        }

        const duration = this.stopwatch.stop();

        this.doLogging(duration);

        this.stopped = true;

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
