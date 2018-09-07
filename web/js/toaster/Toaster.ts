import Toastr from 'toastr';

// needed to enforce that jquery is working.
import $ from '../ui/JQuery';

/**
 * High level interface to create toaster UI popups for messages.
 */
export class Toaster {

    public static success(message: string, title: string = "", options: ToasterOptions = {}) {
        Toastr.success(message, title, options);
    }

    public static warning(message: string, title: string = "", options: ToasterOptions = {}) {
        Toastr.warning(message, title, options);
    }

    public static error(message: string, title: string = "", options: ToasterOptions = {}) {
        Toastr.error(message, title, options);
    }

    /**
     * Create an error that doesn't auto-hide and is a singleton around the same
     * messages and requires the user to acknowledge it...
     *
     * @param message
     */
    public static persistentError(message: string, title: string = "") {

        this.error(message, title, {
            timeOut: 0,
            extendedTimeOut: 0,
            preventDuplicates: true
        });

    }

}

export interface ToasterOptions {
    timeOut?: number;
    extendedTimeOut?: number;
    preventDuplicates?: boolean;
}

export enum ToastrType {

    SUCCESS = "success",

    INFO = "info",

    WARNING = "warning",

    ERROR = "error"

}
