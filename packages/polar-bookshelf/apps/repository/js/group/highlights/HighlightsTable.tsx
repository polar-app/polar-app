import * as React from 'react';
import {GroupHighlightsData} from "./GroupHighlightsData";
import {HighlightCard} from "./HighlightCard";
import {PersistenceLayerManager} from "../../../../../web/js/datastore/PersistenceLayerManager";
import {LoadingProgress} from "../../../../../web/js/ui/LoadingProgress";
import {Pagination} from "../../../../../web/js/ui/Pagination";
import {PersistenceLayerProvider} from "../../../../../web/js/datastore/PersistenceLayer";

export class HighlightsTable extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const {groupHighlightsData} = this.props;

        if (! groupHighlightsData) {
            return <LoadingProgress/>;
        }
        return (
            <Pagination results={groupHighlightsData.docAnnotationProfileRecords}>
                <div className="border-bottom">
                    {groupHighlightsData.docAnnotationProfileRecords.map(docAnnotationProfileRecord =>
                        <HighlightCard persistenceLayerProvider={this.props.persistenceLayerProvider}
                                       key={docAnnotationProfileRecord.value.id}
                                       groupID={groupHighlightsData.group.id}
                                       groupName={groupHighlightsData.group.name!}
                                       docAnnotationProfileRecord={docAnnotationProfileRecord}/>)}
                </div>
            </Pagination>

        );
    }

}

export interface IProps {
    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly groupHighlightsData?: GroupHighlightsData;
}

export interface IState {
}
