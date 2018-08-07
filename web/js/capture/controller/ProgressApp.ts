import $ from '../../ui/JQuery';

const {ProgressUI} = require("./ProgressUI");

export class ProgressApp {

    start() {

        $(document).ready(() => {
            console.log("Starting progress UI");
            let progressUI = new ProgressUI();
            progressUI.init();
        });

    }

}

