import ReactGA, {EventArgs, FieldsObject, OutboundLinkArgs, TrackerNames} from 'react-ga';

const TRACKING_ID = 'UA-122721184-1';

ReactGA.initialize(TRACKING_ID);

export class RendererAnalytics {

    public static event(args: EventArgs, trackerNames?: TrackerNames): void {
        ReactGA.event(args, trackerNames);
    }

    public static pageview(path: string, trackerNames?: TrackerNames, title?: string): void {
        ReactGA.pageview(path, trackerNames, title);
    }

    public static modalview(name: string, trackerNames?: TrackerNames): void {
        ReactGA.modalview(name, trackerNames);
    }

    public static set(fieldsObject: FieldsObject, trackerNames?: TrackerNames): void {
        ReactGA.set(fieldsObject, trackerNames);
    }

    public static outboundLink(args: OutboundLinkArgs, hitCallback?: () => void, trackerNames?: TrackerNames): void {

        if (!hitCallback) {
            // noinspection TsLint
            hitCallback = () => {};
        }

        ReactGA.outboundLink(args, hitCallback, trackerNames);

    }

}
