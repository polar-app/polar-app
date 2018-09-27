import {TriggerEvent} from '../contextmenu/TriggerEvent';
import {Logger} from '../logger/Logger';
import {CommentPopupBoxes} from './react/CommentPopupBoxes';
import {SimpleReactor} from '../reactor/SimpleReactor';
import {CommentEvent} from './react/CommentEvent';

const log = Logger.create();

export class CommentsController {

    private popupElement?: HTMLElement;

    private readonly commentEventDispatcher = new SimpleReactor<CommentEvent>();

    public start(): void {

        window.addEventListener("message", event => this.onMessageReceived(event), false);

        CommentPopupBoxes.create(this.commentEventDispatcher);

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

        this.commentEventDispatcher.dispatchEvent({
            point: triggerEvent.points.client,
            type: 'create'
        });

    }

}
