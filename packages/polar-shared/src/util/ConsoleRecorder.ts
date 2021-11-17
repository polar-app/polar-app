/* tslint:disable:no-console */

import {ISODateTimeString, ISODateTimeStrings} from "../metadata/ISODateTimeStrings";

/**
 * Record all messages written to the console.
 *
 * This is a bit more invasive but we have the ability to record errors recorded
 * by the browser this way.
 *
 * TODO: this would be better implemented with a ring buffer to avoid memory
 * issues but if we're getting that many errors something is wrong.
 */
export namespace ConsoleRecorder {

    export type LogLevel = 'debug' | 'info' | 'error' | 'warn'

    /**
     * The channel we use when we broadcast messages.
     */
    export const CHANNEL = 'console-recorder';

    // eslint-disable-next-line functional/prefer-readonly-type

    // TODO: this should really be a RingBuffer with a max cap so we don't ever
    // run out of memory.

    export const messages: IConsoleMessage[] = [];

    let initialized: boolean = false;

    export interface IConsoleMessage {
        readonly created: ISODateTimeString;
        readonly level: LogLevel;
        readonly message?: any;
        readonly params: any[];
    }

    const delegates = {
        debug: console.debug,
        log: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error
    };

    export function init() {

        try {

            if (initialized) {
                // it's important that we not double initialize because we'll
                // end up with double wrapped console logging functions.
                return;
            }

            interface IError {
                readonly name: string;
                readonly message: string;
                readonly stack?: string;
            }

            function toIError(err: Error): IError {
                return {
                    name: err.name,
                    message: err.message,
                    stack: err.stack
                };
            }

            /**
             *
             */
            function visitObject(obj: any): any {

                if (obj instanceof Error) {
                    return toIError(obj);
                }

                return obj;

            }

            function recordMessage(level: LogLevel, message: any, ...optionalParams: any[]) {

                const created = ISODateTimeStrings.create();

                optionalParams = optionalParams.map(visitObject);

                messages.push({
                    created,
                    level,
                    message,
                    params: optionalParams
                });

            }

            console.debug = (message: any, ...optionalParams: any[]) => {
                recordMessage('debug', message, ...optionalParams);
                delegates.debug(message, ...optionalParams);
            }

            console.log = (message: any, ...optionalParams: any[]) => {
                recordMessage('info', message, ...optionalParams);
                delegates.log(message, ...optionalParams);
            }

            console.info = (message: any, ...optionalParams: any[]) => {
                recordMessage('info', message, ...optionalParams);
                delegates.info(message, ...optionalParams);
            }

            console.warn = (message: any, ...optionalParams: any[]) => {
                recordMessage('warn', message, ...optionalParams);
                broadcastMessage(message);
                delegates.warn(message, ...optionalParams);
            }

            console.error = (message: any, ...optionalParams: any[]) => {
                recordMessage('error', message, ...optionalParams);
                broadcastMessage(message);
                delegates.error(message, ...optionalParams);
            }

            console.info("ConsoleRecorder initialized and capturing messages");

        } finally {
            initialized = true;
        }
    }

    export function stop() {

        console.debug = delegates.debug;
        console.log = delegates.log;
        console.info = delegates.info;
        console.warn = delegates.warn;
        console.error = delegates.error;

        clear();

    }

    export function clear() {
        messages.splice(0, messages.length);
    }

    export function snapshot(): ReadonlyArray<IConsoleMessage> {
        // TODO: make a copy of the object via JSON
        return [...messages]
    }

    export function broadcastMessage(message: IConsoleMessage) {

        if (typeof window !== 'undefined') {
            window.postMessage({
                type: CHANNEL,
                message
            })
        }

    }

}

// NOTE: I don't like this but it's the only way

ConsoleRecorder.init();
