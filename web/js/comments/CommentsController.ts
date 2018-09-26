import {TriggerEvent} from '../contextmenu/TriggerEvent';
import {Logger} from '../logger/Logger';

const log = Logger.create();

export class CommentsController {

    public async start(): Promise<void> {

        window.addEventListener("message", event => this.onMessageReceived(event), false);

    }

    private onMessageReceived(event: any) {

        const data = event.data;

        if (data) {

            if (data.type === 'create-comment') {

                const triggerEvent = TriggerEvent.create(event.data);

                log.debug("Creating comment from trigger event: ", triggerEvent);

                this.createComment(triggerEvent)
                    .catch(err => log.error("Could not create comment: ", err));

            }

        }

    }

    private async createComment(triggerEvent: TriggerEvent) {

        // TODO: create a popup around the given point in the TriggerEvent...

    }

}
