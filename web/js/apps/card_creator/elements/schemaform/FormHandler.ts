import {Logger} from '../../../../logger/Logger';

const log = Logger.create();
/**
 * Handles callbacks from JSON schema form as the form data is changed.
 */
export class FormHandler {

    onChange(data: any) {
        log.info("onChange: ", data);
    }


    onSubmit(data: any) {
        log.info("onSubmit: ", data);
    }


    onError(data: any) {
        log.info("onError: ", data);
    }

}
