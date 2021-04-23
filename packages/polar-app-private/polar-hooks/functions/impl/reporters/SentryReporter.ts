import * as Sentry from "@sentry/node";

Sentry.init({
    dsn: "https://9527bda147244447bd2d8b79a60f4854@o182611.ingest.sentry.io/5499705",
    tracesSampleRate: 1.0,
});

export namespace SentryReporters {

    export function reportError(msg: string, err: Error, tags: {[name: string]: string} = {}) {
        Sentry.captureException(err, {tags});
    }

}

