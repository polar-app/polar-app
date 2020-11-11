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
exports.SideNavStory = exports.Main = void 0;
const React = __importStar(require("react"));
const SideNav_1 = require("../../../web/js/sidenav/SideNav");
const SideNavStore_1 = require("../../../web/js/sidenav/SideNavStore");
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const DocCardImages_1 = require("./doc_cards/DocCardImages");
const SideNavContentRouter_1 = require("../../../web/js/sidenav/SideNavContentRouter");
const Divider_1 = __importDefault(require("@material-ui/core/Divider"));
let seq = 0;
const createWebCard = (id) => {
    return {
        id,
        url: `/apps/stories/side-nav/${id}`,
        title: "Alice's Adventures in Wonderland",
        icon: (React.createElement("img", { src: DocCardImages_1.DocCardImages.WEB_CARD_IMAGE_URL, alt: 'foo' })),
        content: (React.createElement("div", null,
            "this is the content for tab ",
            id)),
        image: {
            url: DocCardImages_1.DocCardImages.WEB_CARD_IMAGE_URL,
            width: 200,
            height: 200
        }
    };
};
const createPDFCard = (id) => {
    return {
        id,
        url: `/apps/stories/side-nav/${id}`,
        title: 'Large-scale Cluster Management at Google with Borg',
        icon: (React.createElement("img", { src: DocCardImages_1.DocCardImages.PDF_CARD_IMAGE_URL, alt: 'foo' })),
        content: (React.createElement("div", null,
            "this is the content for tab ",
            id)),
        image: {
            url: DocCardImages_1.DocCardImages.PDF_CARD_IMAGE_URL,
            width: 200,
            height: 200
        }
    };
};
const createCard = (id) => {
    if (id % 2 === 0) {
        return createPDFCard(id);
    }
    else {
        return createWebCard(id);
    }
};
const Body = () => {
    return (React.createElement("div", { className: "sidenav-body", style: {
            display: 'flex',
            flexGrow: 1
        } },
        React.createElement("div", null,
            React.createElement(SideNav_1.SideNav, null)),
        React.createElement(Divider_1.default, { orientation: "vertical" }),
        React.createElement("div", { style: { flexGrow: 1 } },
            React.createElement(SideNavContentRouter_1.SideNavContentRouter, null))));
};
const Footer = () => {
    const { addTab } = SideNavStore_1.useSideNavCallbacks();
    const doAddTab = React.useCallback(() => {
        const id = seq++;
        addTab(createCard(id));
    }, [addTab]);
    return (React.createElement("div", { className: "sidenav-footer", style: {
            position: 'absolute',
            right: '10px',
            bottom: '10px',
            zIndex: 1000
        } },
        React.createElement(Button_1.default, { color: "primary", variant: "contained", onClick: doAddTab }, "Add Tab")));
};
exports.Main = () => {
    return (React.createElement("div", { className: "sidenav", style: {
            display: 'flex',
            flexDirection: 'column'
        } },
        React.createElement(Body, null),
        React.createElement(Footer, null)));
};
exports.SideNavStory = () => {
    return (React.createElement(SideNavStore_1.SideNavStoreProvider, null,
        React.createElement(exports.Main, null)));
};
//# sourceMappingURL=SideNavStory.js.map