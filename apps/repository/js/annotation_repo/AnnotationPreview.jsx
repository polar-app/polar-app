"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotationPreview = void 0;
var React = require("react");
var ResponsiveImg_1 = require("../../../../web/js/annotation_sidebar/ResponsiveImg");
var DateTimeTableCell_1 = require("../DateTimeTableCell");
var Box_1 = require("@material-ui/core/Box");
var Strings_1 = require("polar-shared/src/util/Strings");
var ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
var useTheme_1 = require("@material-ui/core/styles/useTheme");
var MAX_TEXT_LENGTH = 300;
function createStyle(color) {
    if (color) {
        return {
            borderLeftColor: color,
            borderLeftWidth: '4px',
            borderLeftStyle: 'solid',
            paddingLeft: '5px',
        };
    }
    return {
        paddingLeft: '9px',
        paddingRight: '5px',
    };
}
var ImagePreview = ReactUtils_1.deepMemo(function (props) {
    var img = props.img;
    return (<ResponsiveImg_1.ResponsiveImg id={props.id} img={img} defaultText="No image"/>);
});
var TextPreview = ReactUtils_1.deepMemo(function (props) {
    var text = props.text;
    var truncated = text ? Strings_1.Strings.truncateOnWordBoundary(text, MAX_TEXT_LENGTH, true) : undefined;
    return (<div style={{ userSelect: "none" }} className="text-sm" dangerouslySetInnerHTML={{ __html: truncated || 'no text' }}/>);
});
var PreviewParent = ReactUtils_1.deepMemo(function (props) {
    var style = createStyle(props.color);
    return (<div style={style}>
            {props.children}
        </div>);
});
var Preview = ReactUtils_1.deepMemo(function (props) {
    if (props.img) {
        return <ImagePreview {...props}/>;
    }
    else {
        return <TextPreview {...props}/>;
    }
});
exports.AnnotationPreview = ReactUtils_1.deepMemo(function (props) {
    var theme = useTheme_1.default();
    return (<div id={props.id} className="mt-1">
            <PreviewParent color={props.color}>
                <>
                    <Preview {...props}/>

                    <Box_1.default mt={1} mb={1}>
                        <DateTimeTableCell_1.DateTimeTableCell datetime={props.lastUpdated || props.created} style={{ color: theme.palette.text.secondary }}/>
                    </Box_1.default>
                </>

            </PreviewParent>
        </div>);
});
