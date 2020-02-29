import * as React from 'react';
import {ResponsiveImg} from '../../../../web/js/annotation_sidebar/ResponsiveImg';
import {DateTimeTableCell} from '../DateTimeTableCell';
import {Img} from 'polar-shared/src/metadata/Img';
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {FastComponent} from '../../../../web/js/react/FastComponent';
import {RepoHighlightInfo} from "../RepoAnnotation";
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";

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

export class AnnotationPreview extends FastComponent<IProps> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {};

    }

    public render() {

        return <div id={this.props.id}>

            <Body {...this.props}/>

            <DateTimeTableCell datetime={this.props.created} className="text-muted text-xs"/>

        </div>;

    }

}
interface IProps {
    readonly id: string;
    readonly text?: string;
    readonly img?: Img;
    readonly created: ISODateTimeString;
    readonly color: HighlightColor | undefined;
}
