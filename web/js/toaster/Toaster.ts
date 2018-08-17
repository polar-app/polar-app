import toastr from 'toastr';

export class Toastr {

    static success(message: string, title: string | undefined = undefined) {



        if(title) {
            toastr.success(message, title);
        }

        toastr.success(message);

    }

}

export enum ToastrType {

    SUCCESS = "success",

    INFO = "info",

    WARNING = "warning",

    ERROR = "error"

}
