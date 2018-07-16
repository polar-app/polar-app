/**
 * @renderer
 */
class StartCaptureUI {

    constructor() {
        console.log("Ready to start capture...xxx");

    }

    init() {

        // wire up the event listeners...

        let form = document.getElementById("url-form");
        form.onsubmit = () => this.onSubmit();

    }

    onSubmit() {

        console.log("onSubmit");

        // TODO: trigger the progress page now...

        return false;

    }

}

module.exports.StartCaptureUI = StartCaptureUI;

