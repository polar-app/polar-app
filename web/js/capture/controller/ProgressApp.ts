import $ from '../../ui/JQuery';
import {ProgressUI} from './ProgressUI';

export class ProgressApp {

    start() {

        $(document).ready(() => {
            console.log("Starting progress UI");
            let progressUI = new ProgressUI();
            progressUI.init();
        });

    }

}

