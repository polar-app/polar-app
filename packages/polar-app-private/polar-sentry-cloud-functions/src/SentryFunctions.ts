import * as Sentry from "@sentry/serverless";
import { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";

Sentry.GCPFunction.init({
    dsn: "https://9527bda147244447bd2d8b79a60f4854@o182611.ingest.sentry.io/5499705",
    tracesSampleRate: 1.0,
});

export namespace SentryFunctions {

    export function wrapHttpFunction(delegate: HttpFunction) {

        const wrappedFunction = Sentry.GCPFunction.wrapHttpFunction(delegate);

        if (wrappedFunction === null) {
            throw new Error("Wrapped sentry function was null");
        }

        if (wrappedFunction === undefined) {
            throw new Error("Wrapped sentry function was undefined");
        }

        return wrappedFunction;

    }

    // export const wrapHttpFunction = Sentry.GCPFunction.wrapHttpFunction;

}