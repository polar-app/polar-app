import {isPresent} from '../../js/Preconditions';

export class IFrames {

    computeTopLevelClientRect(clientRect: ClientRect, win: Window): ClientRect {

        while(isPresent(win.frameElement)) {

            let iframeClientRect = win.frameElement.getBoundingClientRect();

            let left = clientRect.left + iframeClientRect.left;
            let top = clientRect.top + iframeClientRect.top;
            let width = clientRect.width;
            let height = clientRect.height;
            let bottom = top + height;
            let right = left + width;

            clientRect = { left, top, width, height, bottom, right };

            win = win.parent;

        }

        return clientRect;

    }

}
