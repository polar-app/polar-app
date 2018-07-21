const {Preconditions} = require("../../../Preconditions");
const {DocFormatFactory} = require("../../../docformat/DocFormatFactory");
const {ipcRenderer} = require('electron');

const log = require("../../../logger/Logger").create();

class AreaHighlightController {

    constructor(model) {
        this.model = Preconditions.assertNotNull(model, "model");
        this.docFormat = DocFormatFactory.getInstance();

        ipcRenderer.on('context-menu-command', (event, arg) => {

            switch (arg.command) {

                case "delete-area-highlight":
                    this.onDeleteAreaHighlight(arg);
                    break;

                default:
                    console.warn("Unhandled command: " + arg.command);
                    break;
            }

        });

    }

    onDocumentLoaded() {
        log.info("onDocumentLoaded: ", this.model.docMeta);
    }

    start() {

        this.model.registerListenerForDocumentLoaded(this.onDocumentLoaded.bind(this));

        window.addEventListener("message", event => this.onMessageReceived(event), false);

    }

    onMessageReceived(event) {

        if (event.data && event.data.type === "create-area-highlight") {
            this.onCreateAreaHighlight(event.data);
        }

        if (event.data && event.data.type === "delete-area-highlight") {
            this.onCreateAreaHighlight(event.data);
        }

    }

    onCreateAreaHighlight(data) {

        log.info("Creating area highlight.");

    }

    onDeleteAreaHighlight(arg) {


    }

}

module.exports.AreaHighlightController = AreaHighlightController;
