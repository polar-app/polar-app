import {TriggerEvent} from '../contextmenu/TriggerEvent';
import {Logger} from '../logger/Logger';
import {CommentCreatedEvent, CommentPopupBoxes, CommentType} from './react/CommentPopupBoxes';
import {SimpleReactor} from '../reactor/SimpleReactor';
import {CommentInputEvent} from './react/CommentInputEvent';
import {Comments} from '../metadata/Comments';
import {Model} from '../model/Model';

const log = Logger.create();

export class CommentsController {

    private popupElement?: HTMLElement;

    private model: Model;

    constructor(model: Model) {
        this.model = model;
    }

    private readonly commentEventDispatcher = new SimpleReactor<CommentInputEvent>();

    public start(): void {

        window.addEventListener("message", event => this.onMessageReceived(event), false);

        CommentPopupBoxes.create(this.commentEventDispatcher,
                                 (commentCreatedEvent) => this.onCommentCreated(commentCreatedEvent));

    }

    private onMessageReceived(event: any) {

        const data = event.data;

        if (data) {

            if (data.type === 'add-comment') {

                const triggerEvent = TriggerEvent.create(event.data);

                log.debug("Creating comment from trigger event: ", triggerEvent);

                this.triggerCreateCommentPopup(triggerEvent)
                    .catch(err => log.error("Could not create comment: ", err));

            }

        }

    }

    private onCommentCreated(commentCreatedEvent: CommentCreatedEvent): void {

        const comment = Comments.createTextComment(commentCreatedEvent.text);

        const docMeta = this.model.docMeta;
        const pageMeta = docMeta.getPageMeta(commentCreatedEvent.pageNum);

        pageMeta.comments[comment.id] = comment;

    }

    private async triggerCreateCommentPopup(triggerEvent: TriggerEvent) {

        this.commentEventDispatcher.dispatchEvent({
            point: triggerEvent.points.client,
            pageNum: triggerEvent.pageNum,
            type: 'create'
        });

    }

}
