"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SimpleHighlightRenderer {
    static renderSelectedContents(selectedContent) {
        selectedContent.rectTexts.forEach(rectText => {
            this.render(document.body, rectText.boundingPageRect);
        });
    }
    static render(parentElement, highlightRect) {
        console.debug("Rendering annotation at: ", highlightRect);
        let highlightElement = document.createElement("div");
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
exports.SimpleHighlightRenderer = SimpleHighlightRenderer;
//# sourceMappingURL=SimpleHighlightRenderer.js.map