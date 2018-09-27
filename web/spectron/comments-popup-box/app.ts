import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {CommentPopupBoxes} from '../../js/comments/react/CommentPopupBoxes';
import {SimpleReactor} from '../../js/reactor/SimpleReactor';
import {CommentEvent} from '../../js/comments/react/CommentEvent';

SpectronRenderer.run(async () => {

    console.log("Running within SpectronRenderer now.");

    this.popupElement = CommentPopupBoxes.createPopupElement();

    document.body.appendChild(this.popupElement);

    const commentEventDispatcher = new SimpleReactor<CommentEvent>();

    CommentPopupBoxes.render(this.popupElement, commentEventDispatcher);
    //
    // commentEventDispatcher.dispatchEvent({
    //     point: {
    //         x: 100,
    //         y: 100
    //     },
    //     type: 'create'
    // });
    //
    document.addEventListener('click', event => {

        commentEventDispatcher.dispatchEvent({
            point: {
                x: event.x,
                y: event.y
            },
            type: 'create'
        });

    });

    // Popup.createAtPoint({x: 100, y: 100}, 'bottom', this.popupElement!);

});
