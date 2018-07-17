const {ProgressUI} = require("../../../../web/js/capture/controller/ProgressUI");
const $ = require("jquery");

$(document).ready(() => {
    console.log("Starting progress UI");
    let progressUI = new ProgressUI();
    progressUI.init();
});

