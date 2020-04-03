import * as React from 'react';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {Optional} from "polar-shared/src/util/ts/Optional";
import {PersistenceLayerProvider} from "../../../../../web/js/datastore/PersistenceLayer";
import {IThumbnail} from "polar-shared/src/metadata/IThumbnail";

export class DocThumbnail extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        const {thumbnails} = this.props;

        const thumbnail = Optional.of((thumbnails || {})['default']).getOrUndefined();

        if (thumbnail) {

            const persistenceLayer = this.props.persistenceLayerProvider();
            const thumbnailFile = persistenceLayer.getFile(thumbnail.src.backend, thumbnail.src);

            const maxWidth = this.props.maxWidth || '125px';
            const maxHeight = this.props.maxHeight || '125px';

            return <img className="border border-dark img-fluid ml-auto mr-auto"
                     src={thumbnailFile.url}
                     style={{maxWidth, maxHeight}}/>
            ;

        } else {
            return <div/>;
        }

    }


}

export interface IProps {
    readonly thumbnails?: { [id: string]: IThumbnail };
    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly maxWidth?: number;
    readonly maxHeight?: number;
}

export interface IState {

}

