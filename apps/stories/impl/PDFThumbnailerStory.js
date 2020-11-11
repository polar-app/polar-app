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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFThumbnailerStory = void 0;
const React = __importStar(require("react"));
const PDFThumbnailer_1 = require("polar-pdf/src/pdf/PDFThumbnailer");
const ReactLifecycleHooks_1 = require("../../../web/js/hooks/ReactLifecycleHooks");
const DataURLs_1 = require("polar-shared/src/util/DataURLs");
const Box_1 = __importDefault(require("@material-ui/core/Box"));
const MUILoading_1 = require("../../../web/js/mui/MUILoading");
const url = 'https://storage.googleapis.com/polar-32b0f.appspot.com/stash/1PwtutApP6pbC1SszLuEzjBpU8V14EZDAnUfGmPN.pdf';
const Thumbnail = (props) => {
    const toDataURL = React.useCallback(() => {
        switch (props.format) {
            case "arraybuffer":
                return DataURLs_1.DataURLs.encode(props.data, props.type);
            case "dataurl":
                return props.data;
        }
    }, [props.data, props.format, props.type]);
    const dataURL = React.useMemo(() => toDataURL(), [toDataURL]);
    return (React.createElement("div", null,
        React.createElement("img", { src: dataURL, width: props.scaledDimensions.width, height: props.scaledDimensions.height })));
};
exports.PDFThumbnailerStory = () => {
    const [thumbnail, setThumbnail] = React.useState();
    const doAsync = React.useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Generating thumbnail...");
        const thumbnail = yield PDFThumbnailer_1.PDFThumbnailer.generate({
            pathOrURL: url,
            scaleBy: 'width',
            value: 300
        });
        setThumbnail(thumbnail);
    }), []);
    ReactLifecycleHooks_1.useComponentDidMount(() => {
        doAsync().catch(err => console.error(err));
    });
    if (!thumbnail) {
        return React.createElement(MUILoading_1.MUILoading, null);
    }
    return (React.createElement("div", null,
        React.createElement("b", null, "type: "),
        " ",
        thumbnail.type,
        " ",
        React.createElement("br", null),
        React.createElement("b", null, "format: "),
        " ",
        thumbnail.format,
        " ",
        React.createElement("br", null),
        React.createElement("b", null, "nativeDimensions: "),
        " ",
        thumbnail.nativeDimensions.width,
        "x",
        thumbnail.nativeDimensions.height,
        " ",
        React.createElement("br", null),
        React.createElement("b", null, "scaledDimensions: "),
        " ",
        thumbnail.scaledDimensions.width,
        "x",
        thumbnail.scaledDimensions.height,
        " ",
        React.createElement("br", null),
        React.createElement(Box_1.default, { mt: 1, mb: 1 },
            React.createElement(Thumbnail, Object.assign({}, thumbnail)))));
};
//# sourceMappingURL=PDFThumbnailerStory.js.map