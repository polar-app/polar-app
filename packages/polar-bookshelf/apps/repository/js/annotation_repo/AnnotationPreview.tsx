import * as React from 'react';
import {ResponsiveImg} from '../../../../web/js/annotation_sidebar/ResponsiveImg';
import {DateTimeTableCell} from '../DateTimeTableCell';
import {Img} from 'polar-shared/src/metadata/Img';
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import Box from '@material-ui/core/Box';
import isEqual from "react-fast-compare";
import {PlainTextStr, Strings} from "polar-shared/src/util/Strings";

const MAX_TEXT_LENGTH = 300;

interface IProps {
    readonly id: string;
    readonly text?: PlainTextStr;
    readonly img?: Img;
    readonly lastUpdated: ISODateTimeString;
    readonly created: ISODateTimeString;
    readonly color: HighlightColor | undefined;
}

const createStyle = (color: HighlightColor | undefined): React.CSSProperties => {

    if (color) {

        return {
            borderLeftColor: color,
            borderLeftWidth: '2px',
            borderLeftStyle: 'solid',
            paddingLeft: '5px',
        };

    }

    return {};

};

const Body = React.memo((props: IProps) => {

    const {text, img} = props;

    const truncated = text ? Strings.truncateOnWordBoundary(text, MAX_TEXT_LENGTH, true) : undefined;

    const style = createStyle(props.color);

    if (img) {
        return <div style={style}>
            <ResponsiveImg id={props.id} img={img} defaultText="No image"/>
        </div>;

    } else {
        return (
            <div id={props.id} style={style}>
                <div style={{
                         userSelect: "none",
                     }}
                     dangerouslySetInnerHTML={{__html: truncated || 'no text'}}/>
            </div>
        );
    }

}, isEqual);

export const AnnotationPreview = React.memo((props: IProps) => (
    <div id={props.id}>
        <Body {...props}/>
        <Box pt={1}>
            <DateTimeTableCell datetime={props.lastUpdated || props.created}
                               className="text-muted text-xs"/>
        </Box>
    </div>
));
