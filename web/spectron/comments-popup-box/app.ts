import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {CommentsDOM} from '../../js/comments/react/CommentsDOM';
import {Popup} from '../../js/ui/popup/Popup';

SpectronRenderer.run(async () => {
    console.log("Running within SpectronRenderer now.");

    this.popupElement = CommentsDOM.createPopupElement();

    document.body.appendChild(this.popupElement);

    CommentsDOM.render(this.popupElement);

    Popup.createAtPoint({x: 100, y: 100}, 'bottom', this.popupElement!);

});
