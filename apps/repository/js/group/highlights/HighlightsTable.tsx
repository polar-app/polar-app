import * as React from 'react';
import {GroupHighlightsData} from "./GroupHighlightsData";
import {HighlightCard} from "./HighlightCard";
import {PersistenceLayerManager} from "../../../../../web/js/datastore/PersistenceLayerManager";

export class HighlightsTable extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const {groupHighlightsData} = this.props;

        if (! groupHighlightsData) {
            return <div/>;
        }
        return (

            <div className="border-bottom">
                {groupHighlightsData.docAnnotationProfileRecords.map(docAnnotationProfileRecord =>
                    <HighlightCard persistenceLayerProvider={() => this.props.persistenceLayerManager.get()}
                                   key={docAnnotationProfileRecord.value.id} docAnnotationProfileRecord={docAnnotationProfileRecord}/>)}
            </div>

        );
    }

}

export interface IProps {
    readonly persistenceLayerManager: PersistenceLayerManager;
    readonly groupHighlightsData?: GroupHighlightsData;
}

export interface IState {
}
