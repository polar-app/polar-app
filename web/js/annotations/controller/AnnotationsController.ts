import {DialogWindow, DialogWindowOptions, Resource, ResourceType} from '../../ui/dialog_window/DialogWindow';
import Point = Electron.Point;
import {DialogWindowClient} from '../../ui/dialog_window/DialogWindowClient';
import {Logger} from '../../logger/Logger';

const log = Logger.create();

export class AnnotationsController {

    //private dialogWindow: DialogWindow;

    /**
     * Create a new flashcard.
     */
    async createFlashcard(context: any, pageNum: number, pageOffset: Point) {
        await this.createDialogWindow();
    }

    async start() {

        window.addEventListener("message", event => this.onMessageReceived(event), false);
        //CardCreatorWebComponent.register();


    }

    async createDialogWindow() {
        let appPath = "./apps/card-creator/index.html";
        let resource = new Resource(ResourceType.FILE, appPath);
        let options = new DialogWindowOptions(resource);

        let dialogWindowClient = new DialogWindowClient();
        await  dialogWindowClient.create(options);
    }

    onMessageReceived(event: any) {

        // get the page number

        let data = event.data;
        let matchingSelectors = data.matchingSelectors;
        let matchingSelector = matchingSelectors[".page"];

        let pageNum: number = matchingSelector.annotationDescriptors[0].pageNumber;

        if(data && data.type === "create-flashcard") {
            this.createFlashcard(event.context, pageNum, data.points.pageOffset)
                .catch(err => log.error("Could not create flashcard: ", err));
        }

    }

}
