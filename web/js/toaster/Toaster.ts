import Toastr from 'toastr';

// needed to enforce that jquery is working.
import $ from '../ui/JQuery';

/**
 * High level interface to create toaster UI popups for messages.
 */
export class Toaster {

    static success(message: string, title: string = "", options: ToasterOptions = {}) {
        Toastr.success(message, title, options);
    }

    static warning(message: string, title: string = "", options: ToasterOptions = {}) {
        Toastr.warning(message, title, options);
    }

    static error(message: string, title: string = "", options: ToasterOptions = {}) {
        Toastr.error(message, title, options);
    }

}

export interface ToasterOptions {
    timeOut?: number;
}

export enum ToastrType {

    SUCCESS = "success",

    INFO = "info",

    WARNING = "warning",

    ERROR = "error"

}
