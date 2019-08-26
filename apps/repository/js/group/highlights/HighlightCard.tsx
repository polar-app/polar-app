import * as React from 'react';
import {PersistenceLayerProvider} from "../../../../../web/js/datastore/PersistenceLayer";
import {GroupDocAnnotation} from "../../../../../web/js/datastore/sharing/db/doc_annotations/GroupDocAnnotations";
import {DocAnnotationComponent} from "./annotations/DocAnnotationComponent";
import {ProfileRecord} from "../../../../../web/js/datastore/sharing/db/ProfileJoins";
import {ProfileHeader} from "./ProfileHeader";
import {DocFooter} from "./DocFooter";
import {GroupIDStr} from "../../../../../web/js/datastore/Datastore";

export class HighlightCard extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <div className="border-top border-left border-right p-2">

                <div style={{display: 'flex'}}>

                    <div style={{flexGrow: 1}}
                         className="mt-auto mb-auto">

                        <ProfileHeader docAnnotationProfileRecord={this.props.docAnnotationProfileRecord}/>

                    </div>

                </div>

                <div>
                    {/*{this.props.original}*/}
                </div>

                <div style={{display: 'flex'}} className="mt-2">

                    <div className="text-grey600">

                        <DocAnnotationComponent persistenceLayerProvider={this.props.persistenceLayerProvider}
                                                docAnnotationProfileRecord={this.props.docAnnotationProfileRecord}/>

                        {/*<Moment withTitle={true}*/}
                        {/*        titleFormat="D MMM YYYY hh:MM A"*/}
                        {/*        format="MMM DD YYYY HH:mm A"*/}
                        {/*        ago*/}
                        {/*        filter={(value) => value.replace(/^an? /g, '1 ')}>*/}
                        {/*    {this.props.published}*/}
                        {/*</Moment>*/}

                    </div>
                </div>

                <div>

                    <DocFooter persistenceLayerProvider={this.props.persistenceLayerProvider}
                               groupID={this.props.groupID}
                               docAnnotationProfileRecord={this.props.docAnnotationProfileRecord}/>

                </div>

            </div>

        );
    }

}

export interface IProps {
    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly groupID: GroupIDStr;
    readonly docAnnotationProfileRecord: ProfileRecord<GroupDocAnnotation>;

}

export interface IState {
}
