import * as React from 'react';
import {PersistenceLayerProvider} from "../../../../../web/js/datastore/PersistenceLayer";
import {GroupDocAnnotation} from "../../../../../web/js/datastore/sharing/db/doc_annotations/GroupDocAnnotations";
import {DocAnnotationComponent} from "./annotations/DocAnnotationComponent";
import {ProfileRecord} from "../../../../../web/js/datastore/sharing/db/ProfileJoins";
import {Profile} from "../../../../../web/js/datastore/sharing/db/Profiles";

export class ProfileHeader extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const {profile} = this.props;

        if (profile) {

            return (

                <div style={{display: 'flex'}}>
                    <div>{profile.name || profile.handle}</div>
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
    readonly profile?: Profile;
}

export interface IState {
}
