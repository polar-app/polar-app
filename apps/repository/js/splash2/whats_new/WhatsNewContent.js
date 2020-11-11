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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsNewContent = void 0;
const React = __importStar(require("react"));
const ReleaseMetadatas_1 = require("polar-release-metadata/src/ReleaseMetadatas");
const Arrays_1 = require("polar-shared/src/util/Arrays");
const DateMoment_1 = require("../../../../../web/js/ui/util/DateMoment");
const releases = ReleaseMetadatas_1.ReleaseMetadatas.get();
exports.WhatsNewContent = React.memo(() => {
    const release = Arrays_1.Arrays.first(releases);
    if (!release) {
        return null;
    }
    const VideoEmbed = () => {
        if (release.video_embed) {
            return (React.createElement("div", { className: "embed-responsive embed-responsive-16by9 mt-1 mb-1" },
                React.createElement("iframe", { className: "embed-responsive-item", width: "560", height: "315", src: release.video_embed, frameBorder: "0", allow: "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture", allowFullScreen: true })));
        }
        return null;
    };
    return (React.createElement("div", null,
        React.createElement(VideoEmbed, null),
        React.createElement("h1", null, release.title),
        React.createElement("div", { className: "mb-1" },
            React.createElement("span", { className: "text-muted ml-1" },
                React.createElement(DateMoment_1.DateMoment, { datetime: release.date }))),
        React.createElement("div", { className: "text-sm", dangerouslySetInnerHTML: { __html: release.html } })));
});
//# sourceMappingURL=WhatsNewContent.js.map