import * as React from 'react';
import {ResponsiveImg} from '../../../../web/js/annotation_sidebar/ResponsiveImg';
import {DateTimeTableCell} from '../DateTimeTableCell';
import {Img} from 'polar-shared/src/metadata/Img';
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";

interface IProps {
    readonly id: string;
    readonly text?: string;
    readonly img?: Img;
    readonly created: ISODateTimeString;
    readonly color: HighlightColor | undefined;
}

const Body = (props: IProps) => {

    const {text, img} = props;

    const createStyle = (): React.CSSProperties => {

        if (props.color) {

            return {
                borderLeftColor: props.color,
                borderLeftWidth: '2px',
                borderLeftStyle: 'solid',
                paddingLeft: '5px'
            };

        }

        return {};

    };

    const style = createStyle();

    if (img) {
        return <div style={style}>
            <ResponsiveImg id={props.id} img={img} defaultText="No image"/>
        </div>;

    } else {
        return (
            <div id={props.id} style={style}>
                <div dangerouslySetInnerHTML={{__html: text || 'no text'}}></div>
            </div>
        );
    }

};

export const AnnotationPreview = (props: IProps) => (
    <div id={props.id}>
        <Body {...props}/>
        <DateTimeTableCell datetime={props.created} className="text-muted text-xs"/>
    </div>
)
