import $ from '../../ui/JQuery';
import {ProgressUI} from './ProgressUI';

export class ProgressApp {

    public start() {

        $(document).ready(() => {
            console.log("Starting progress UI");
            const progressUI = new ProgressUI();
            progressUI.init();
        });

    }

}

