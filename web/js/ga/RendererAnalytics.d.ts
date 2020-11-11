export declare class RendererAnalytics {
    static event(args: IEventArgs): void;
    static pageviewFromLocation(): void;
    static identify(uid: string): void;
    static pageview(path: string, hostname?: string, title?: string): void;
    static timing(category: string, variable: string, time: string | number): void;
    static createTimer(category: string, variable: string): Timer;
    static withTimer<T>(category: string, variable: string, closure: () => T): T;
    static withTimerAsync<T>(category: string, variable: string, closure: () => Promise<T>): Promise<T>;
    static createTracer(category: string): Tracer;
    static set(fieldsObject: IFieldsObject): void;
}
export interface IEventArgs {
    category: string;
    action: string;
}
export interface IFieldsObject {
    [i: string]: any;
}
export interface Timer {
    stop(): void;
}
export interface Tracer {
    trace<T>(variable: string, closure: () => T): T;
    traceAsync<T>(variable: string, closure: () => Promise<T>): Promise<T>;
}
export declare class NullTracer implements Tracer {
    trace<T>(variable: string, closure: () => T): T;
    traceAsync<T>(variable: string, closure: () => Promise<T>): Promise<T>;
}
