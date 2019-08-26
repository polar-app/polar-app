import * as React from 'react';
import {PersistenceLayerProvider} from "../../../../../web/js/datastore/PersistenceLayer";
import {GroupDocAnnotation} from "../../../../../web/js/datastore/sharing/db/doc_annotations/GroupDocAnnotations";
import {DocAnnotationComponent} from "./annotations/DocAnnotationComponent";
import {ProfileRecord} from "../../../../../web/js/datastore/sharing/db/ProfileJoins";
import {Profile} from "../../../../../web/js/datastore/sharing/db/Profiles";
import {DocAnnotationMoment} from "../../../../../web/js/annotation_sidebar/DocAnnotationMoment";
import {BaseDocAnnotation} from "../../../../../web/js/datastore/sharing/db/doc_annotations/BaseDocAnnotation";
import {RelativeMoment} from "../../../../../web/js/ui/util/RelativeMoment";

export class ProfileHeader extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const {props} = this;
        const {docAnnotationProfileRecord} = props;
        const {profile} = this.props.docAnnotationProfileRecord;
        const docAnnotation = docAnnotationProfileRecord.value;

        if (profile) {

            return (

                <div style={{display: 'flex'}}>

                    <div>{profile.name || profile.handle}</div>

                    <div className="text-grey200 ml-1">
                        <RelativeMoment datetime={docAnnotation.lastUpdated || docAnnotation.created}/>
                    </div>

                </div>

            );

        } else {

            return (
                <div/>
            );

        }

    }

}

export interface IProps {
    readonly docAnnotationProfileRecord: ProfileRecord<BaseDocAnnotation>;
}

export interface IState {
}
