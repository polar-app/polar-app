import {Rollbars} from "../util/Rollbars";

const rollbar = Rollbars.create();

export namespace RollbarReporters {

    export function reportError(msg: string, err: Error) {
        rollbar.log(msg, err);
    }

}

