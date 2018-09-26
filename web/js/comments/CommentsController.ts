import {TriggerEvent} from '../contextmenu/TriggerEvent';
import {Logger} from '../logger/Logger';
import {Elements} from '../util/Elements';
import {Popup} from '../ui/popup/Popup';
import {CommentsDOM} from './react/CommentsDOM';

const log = Logger.create();

export class CommentsController {

    private popupElement?: HTMLElement;

    public start(): void {

        window.addEventListener("message", event => this.onMessageReceived(event), false);

        this.popupElement = CommentsDOM.createPopupElement();

        document.body.appendChild(this.popupElement);

        CommentsDOM.render(this.popupElement);

    }

    private onMessageReceived(event: any) {

        const data = event.data;

        if (data) {

            if (data.type === 'add-comment') {

                const triggerEvent = TriggerEvent.create(event.data);

                log.debug("Creating comment from trigger event: ", triggerEvent);

                this.createComment(triggerEvent)
                    .catch(err => log.error("Could not create comment: ", err));

            }

        }

    }

    private async createComment(triggerEvent: TriggerEvent) {

        // TODO: create a popup around the given point in the TriggerEvent...

        Popup.createAtPoint(triggerEvent.points.client, 'bottom', this.popupElement!);

    }

}
