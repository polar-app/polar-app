/**
 * Simple renderer that places highlights in the DOM.  Ideally we could use
 * something simple like this in the future.
 */
import {SelectedContent} from '../selection/SelectedContent';
import {Rect} from '../../../Rect';

export class SimpleHighlightRenderer {

    static renderSelectedContents(selectedContent: SelectedContent) {

        selectedContent.rectTexts.forEach(rectText => {
            this.render(document.body, rectText.boundingPageRect);
        });

    }

    static render(parentElement: HTMLElement, highlightRect: Rect) {

        console.debug("Rendering annotation at: ", highlightRect);

        let highlightElement = document.createElement("div");

        // highlightElement.setAttribute("data-type", "text-highlight");
        // highlightElement.setAttribute("data-doc-fingerprint", textHighlightEvent.docMeta.docInfo.fingerprint);
        // highlightElement.setAttribute("data-text-highlight-id", textHighlightEvent.textHighlight.id);
        // highlightElement.setAttribute("data-page-num", `${textHighlightEvent.pageMeta.pageInfo.num}`);

        //highlightElement.className = `text-highlight annotation text-highlight-${textHighlightEvent.textHighlight.id}`;
        highlightElement.className = `text-highlight annotation`;

        highlightElement.style.position = "absolute";
        highlightElement.style.backgroundColor = `yellow`;
        highlightElement.style.opacity = `0.5`;

        highlightElement.style.left = `${highlightRect.left}px`;
        highlightElement.style.top = `${highlightRect.top}px`;

        highlightElement.style.width = `${highlightRect.width}px`;
        highlightElement.style.height = `${highlightRect.height}px`;

        parentElement.insertBefore(highlightElement, parentElement.firstChild);

    }

}
