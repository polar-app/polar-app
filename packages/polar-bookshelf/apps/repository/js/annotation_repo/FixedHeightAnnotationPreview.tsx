import * as React from 'react';
import {ResponsiveImg} from '../../../../web/js/annotation_sidebar/ResponsiveImg';
import {DateTimeTableCell} from '../DateTimeTableCell';
import {Img} from 'polar-shared/src/metadata/Img';
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import Box from '@material-ui/core/Box';
import {PlainTextStr, Strings} from "polar-shared/src/util/Strings";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import useTheme from '@material-ui/core/styles/useTheme';
import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";

const MAX_IMG_HEIGHT = 300;

function createStyle(color: HighlightColor | undefined): React.CSSProperties {

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

const ImagePreview = deepMemo(function ImagePreview(props: IProps) {
    const {img} = props;

    if (! img) {
        return (
            <div>
                No image
            </div>
        );
    }

    const height = Math.min(img.height, MAX_IMG_HEIGHT);

    return (
        <div className="ImagePreview"
             style={{
                 display: 'flex',
                 height,
             }}>

            <ResponsiveImg id={props.id}
                           img={{...img, height}}
                           defaultText="No image"
                           style={{
                               marginLeft: 'auto',
                               marginRight: 'auto'
                           }}/>

        </div>
    );

});

interface ITextPreviewHeight {
    readonly maxTextLength: number;
    readonly height: number;

    // debug variables

    readonly nrRowsForTextPX: number;

}

export function calculateTextPreviewHeight(text: string): ITextPreviewHeight {

    const defaultDockWidthPX = 450;
    const fontSizePX = 14;
    const lineHeightPX = 20;

    const textWidthPX = text.length * fontSizePX;
    const nrRowsForTextPX = Math.floor(textWidthPX / defaultDockWidthPX) + 1;

    const rows = Math.min(nrRowsForTextPX, 4);

    const charactersPerRow = Math.floor(defaultDockWidthPX / fontSizePX);
    const maxTextLength = charactersPerRow * rows;

    const height = rows * lineHeightPX;

    return {maxTextLength, height, nrRowsForTextPX};

}

const TextPreview = deepMemo(function TextPreview(props: IProps) {

    const {text} = props;

    const textPreviewHeight = calculateTextPreviewHeight(text || '');

    // const truncated = text ? Strings.truncateOnWordBoundary(text, textPreviewHeight.maxTextLength, true) : undefined;

    const truncated = text;

    return (
        <div style={{
                 userSelect: "none",
                 height: textPreviewHeight.height,
                 overflow: 'hidden',
                 fontSize: '14px'
             }}
             dangerouslySetInnerHTML={{__html: truncated || 'no text'}}/>
    );

});

interface PreviewParentProps {
    readonly color: HighlightColor | undefined;
    readonly children: React.ReactElement;
}

const PreviewParent = deepMemo(function PreviewParent(props: PreviewParentProps) {

    const style = createStyle(props.color);

    return (
        <div style={style}>
            {props.children}
        </div>
    );

});

const Preview = deepMemo(function Preview(props: IProps) {

    if (props.img) {
        return <ImagePreview {...props}/>;
    } else {
        return <TextPreview {...props}/>;
    }

});

interface IProps {
    readonly id: string;
    readonly text?: PlainTextStr;
    readonly img?: Img;
    readonly lastUpdated: ISODateTimeString;
    readonly created: ISODateTimeString;
    readonly color: HighlightColor | undefined;
}

export function useFixedHeightAnnotationCalculator() {

    const theme = useTheme();

    const margin = theme.spacing(3);

    return (annotation: IDocAnnotation): number => {
        if (annotation.img) {
            return Math.min(annotation.img.height, MAX_IMG_HEIGHT) + margin;
        }

        const textPreviewHeight = calculateTextPreviewHeight(annotation.text || '');
        return textPreviewHeight.height + margin;
    };

}

export const FixedHeightAnnotationPreview = deepMemo(function FixedHeightAnnotationPreview(props: IProps) {

    const theme = useTheme();

    return (
        <Box id={props.id} mt={1} mb={1}>
            <PreviewParent color={props.color}>
                <>
                    <Preview {...props}/>

                    <Box mt={1}>
                        <DateTimeTableCell
                            datetime={props.lastUpdated || props.created}
                            style={{color: theme.palette.text.secondary}}/>
                    </Box>
                </>

            </PreviewParent>
        </Box>
    );
});
