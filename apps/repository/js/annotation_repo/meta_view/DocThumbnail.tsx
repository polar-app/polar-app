import * as React from 'react';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {Optional} from "polar-shared/src/util/ts/Optional";
import {PersistenceLayerProvider} from "../../../../../web/js/datastore/PersistenceLayer";

export class DocThumbnail extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        const {docInfo} = this.props;

        const thumbnail = Optional.of((docInfo.thumbnails || {})['default']).getOrUndefined();

        if (thumbnail) {

            const persistenceLayer = this.props.persistenceLayerProvider();
            const thumbnailFile = persistenceLayer.getFile(thumbnail.src.backend, thumbnail.src);

            return <img className="border border-dark" src={thumbnailFile.url} style={{maxWidth: '125px', maxHeight: '125px'}}/>;

        } else {
            return <div/>;
        }

    }


}

export interface IProps {
    readonly docInfo: IDocInfo;
    readonly persistenceLayerProvider: PersistenceLayerProvider;
}

export interface IState {

}

