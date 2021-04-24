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

    return (
        <div style={{display: 'flex'}}>

            <ResponsiveImg id={props.id} img={img} defaultText="No image"/>

        </div>
    );

});

const TextPreview = deepMemo(function TextPreview(props: IProps) {

    const {text} = props;

    return (
        <div style={{userSelect: "none", fontSize: '1.1rem'}}
             className="text-sm"
             dangerouslySetInnerHTML={{__html: text || 'no text'}}/>
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

export const AnnotationPreview = deepMemo(function AnnotationPreview(props: IProps) {

    const theme = useTheme();

    return (
        <div id={props.id} className="mt-1">
            <PreviewParent color={props.color}>
                <>
                    <Preview {...props}/>

                    {/*<Box mt={1} mb={1}>*/}
                    {/*    <DateTimeTableCell*/}
                    {/*        datetime={props.lastUpdated || props.created}*/}
                    {/*        style={{color: theme.palette.text.secondary}}/>*/}
                    {/*</Box>*/}
                </>

            </PreviewParent>
        </div>
    );
});
