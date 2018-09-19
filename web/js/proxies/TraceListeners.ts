import {TraceListener} from './TraceListener';

export class TraceListeners {

    /**
     * Convert this to an array so that we're always working with an array.
     *
     */
    public static asArray(input: TraceListener | TraceListener[]): TraceListener[] {

        if (! input) {
            return [];
        }

        if (! Array.isArray(input)) {
            return [input];
        }

        return input;

    }

}
