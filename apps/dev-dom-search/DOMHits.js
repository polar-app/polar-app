"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOMHits = void 0;
const react_1 = __importDefault(require("react"));
const Content_1 = require("./Content");
const SearchBar_1 = require("./SearchBar");
const DOMHighlights_1 = require("../../web/js/dom_highlighter/DOMHighlights");
const DOMTextIndexes_1 = require("polar-dom-text-search/src/DOMTextIndexes");
exports.DOMHits = () => {
    const [hits, setHits] = react_1.default.useState([]);
    function handleSearch(text) {
        if (text.trim() === '') {
            setHits([]);
            return;
        }
        const index = DOMTextIndexes_1.DOMTextIndexes.create(document, document.getElementById('content'));
        const hits = index.search(text, 0, { caseInsensitive: true });
        setHits(hits);
        console.log("Found N hits: " + hits.length, hits);
    }
    return (react_1.default.createElement("div", { style: { padding: '15px' } },
        react_1.default.createElement(SearchBar_1.SearchBar, { onSearch: handleSearch }),
        react_1.default.createElement(Content_1.Content, null),
        react_1.default.createElement(DOMHighlights_1.DOMHighlights, { hits: hits })));
};
//# sourceMappingURL=DOMHits.js.map