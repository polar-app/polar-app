// import {IEventArgs, TraitsMap, UserIdentificationStr} from "../IAnalytics";
// import {Segments} from "./Segments";
//
// function isBrowser() {
//     return typeof window !== 'undefined';
// }
//
// function createAnalytics(): SegmentAnalytics.AnalyticsJS {
//
//     if (isBrowser()) {
//         const analytics: SegmentAnalytics.AnalyticsJS = Segments.getInstance();
//         analytics.load("ogIRcN7inQDBxIYySQtDZjBUHepranLX");
//         return analytics;
//     }
//
//     return null!;
//
// }
//
// const analytics = createAnalytics();
//
// export class SegmentAnalytics {
//
//     public event(evt: IEventArgs) {
//         const eventName = `${evt.action}/${evt.action}`;
//         analytics.track(eventName);
//     }
//
//     public page(pageName: string) {
//         analytics.page(pageName);
//     }
//
//     public identify(userId: UserIdentificationStr) {
//         analytics.identify(userId);
//     }
//
//     public traits(map: TraitsMap) {
//         analytics.identify(map);
//     }
//
// }
