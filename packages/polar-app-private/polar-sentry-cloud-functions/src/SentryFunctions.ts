import * as Sentry from "@sentry/serverless";
import { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";

Sentry.GCPFunction.init({
    dsn: "https://9527bda147244447bd2d8b79a60f4854@o182611.ingest.sentry.io/5499705",
    tracesSampleRate: 1.0,
});

export namespace SentryFunctions {

    export function wrapHttpFunction(delegate: HttpFunction) {
        return Sentry.GCPFunction.wrapHttpFunction(delegate);
    }

    // export const wrapHttpFunction = Sentry.GCPFunction.wrapHttpFunction;

}