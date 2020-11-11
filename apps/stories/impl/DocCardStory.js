"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocCardStory = void 0;
const React = __importStar(require("react"));
const DocCard_1 = require("./doc_cards/DocCard");
const Grid_1 = __importDefault(require("@material-ui/core/Grid"));
const DocCardImages_1 = require("./doc_cards/DocCardImages");
const PDFCard = () => (React.createElement(Grid_1.default, { item: true, style: { flexGrow: 1, display: 'flex' } },
    React.createElement("div", { style: { marginLeft: 'auto', marginRight: 'auto' } },
        React.createElement(DocCard_1.DocCard, { title: "Large Scale Cluster Management with Google Borg", description: "This is a description", imgURL: DocCardImages_1.DocCardImages.PDF_CARD_IMAGE_URL }))));
const WebCard = () => (React.createElement(Grid_1.default, { item: true, style: { flexGrow: 1, display: 'flex' } },
    React.createElement("div", { style: { marginLeft: 'auto', marginRight: 'auto' } },
        React.createElement(DocCard_1.DocCard, { title: "Alice in Wonderland", description: "Alice's Adventures in Wonderland (commonly shortened to Alice in Wonderland) is an 1865 novel by English author Lewis Carroll (the pseudonym of Charles Dodgson). It tells of a young girl named Alice, who falls through a rabbit hole into a subterranean fantasy world populated by peculiar, anthropomorphic creatures", imgURL: DocCardImages_1.DocCardImages.WEB_CARD_IMAGE_URL }))));
exports.DocCardStory = () => {
    return (React.createElement(Grid_1.default, { container: true, spacing: 3 },
        React.createElement(PDFCard, null),
        React.createElement(WebCard, null),
        React.createElement(PDFCard, null),
        React.createElement(WebCard, null),
        React.createElement(PDFCard, null),
        React.createElement(WebCard, null),
        React.createElement(PDFCard, null),
        React.createElement(WebCard, null),
        React.createElement(PDFCard, null),
        React.createElement(WebCard, null),
        React.createElement(PDFCard, null),
        React.createElement(WebCard, null)));
};
//# sourceMappingURL=DocCardStory.js.map