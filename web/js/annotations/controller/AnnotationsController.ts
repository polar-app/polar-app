import {
    DialogWindow,
    DialogWindowOptions,
    Resource,
    ResourceType
} from '../../ui/dialog_window/DialogWindow';
import Point = Electron.Point;

const {FormHandler} = require("../FormHandler");

export class AnnotationsController {

    private dialogWindow: DialogWindow;

    /**
     * Create a new flashcard.
     */
    createFlashcard(context: any, pageNum: number, pageOffset: Point) {
        this.dialogWindow.show();
    }

    async start() {

        window.addEventListener("message", event => this.onMessageReceived(event), false);
        //CardCreatorWebComponent.register();

        let appPath = "./apps/card-creator/index.html";
        let resource = new Resource(ResourceType.FILE, appPath);
        let options = new DialogWindowOptions(resource);

        this.dialogWindow = await DialogWindow.create(options);

    }

    onMessageReceived(event: any) {

        // get the page number

        let data = event.data;
        let matchingSelectors = data.matchingSelectors;
        let matchingSelector = matchingSelectors[".page"];

        let pageNum: number = matchingSelector.annotationDescriptors[0].pageNumber;

        if(data && data.type === "create-flashcard") {
            this.createFlashcard(event.context, pageNum, data.points.pageOffset);
        }

    }

}
