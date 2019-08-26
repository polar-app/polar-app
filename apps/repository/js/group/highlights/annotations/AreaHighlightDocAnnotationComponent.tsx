import * as React from 'react';
import {BaseDocAnnotation} from "../../../../../../web/js/datastore/sharing/db/doc_annotations/BaseDocAnnotation";
import {HighlightColors} from "../../../../../../web/js/metadata/HighlightColor";
import {ResponsiveImg} from "../../../../../../web/js/annotation_sidebar/ResponsiveImg";
import {IAreaHighlight} from "../../../../../../web/js/metadata/IAreaHighlight";
import {DocFileResolvers} from "../../../../../../web/js/datastore/DocFileResolvers";
import {PersistenceLayerProvider} from "../../../../../../web/js/datastore/PersistenceLayer";
import {Images} from "../../../../../../web/js/metadata/Images";

const Image = (props: IProps) => {

    const {docAnnotation, persistenceLayerProvider} = props;
    const areaHighlight = docAnnotation.original as IAreaHighlight;

    const docFileResolver = DocFileResolvers.createForPersistenceLayer(persistenceLayerProvider);

    const img = Images.toImg(docFileResolver, areaHighlight.image);

    if (img) {

        return (
            <ResponsiveImg id={areaHighlight.id} img={img} color={areaHighlight.color}/>
        );

    } else {
        return (
            <div>No image</div>
        );
    }

};

export class AreaHighlightDocAnnotationComponent extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {};

    }

    public render() {
        const {props} = this;
        const {docAnnotation} = props;

        const areaHighlight = docAnnotation.original as IAreaHighlight;

        const key = 'area-highlight' + docAnnotation.id;
        const borderColor = HighlightColors.toBackgroundColor(areaHighlight.color, 0.7);

        return (

            <div key={key}
                 className='p-1'>

                <div style={{
                    borderLeft: `5px solid ${borderColor}`
                }}>

                    <Image persistenceLayerProvider={this.props.persistenceLayerProvider}
                           docAnnotation={docAnnotation}/>

                </div>

            </div>
        );

    }

}
interface IProps {
    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly docAnnotation: BaseDocAnnotation;
}

interface IState {
}

