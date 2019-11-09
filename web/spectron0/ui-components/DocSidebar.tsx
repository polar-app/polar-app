import * as React from 'react';
import {DocDetail} from "../../js/metadata/DocDetail";
import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {PropertyTable} from "./PropertyTable";
import {Tag} from "polar-shared/src/tags/Tags";
import {DocThumbnail} from "../../../apps/repository/js/annotation_repo/meta_view/DocThumbnail";
import {PersistenceLayerProvider} from "../../js/datastore/PersistenceLayer";
import {IThumbnail} from "polar-shared/src/metadata/IThumbnail";

// TODO:
//     - format the URL with an <a>
// - make sure all metadata is covered
// - add pmid and other identifiers to model
// - add description here.
// - add abstract
// - add open button
// - tags (important so I don't have to put these in the

/**
 * The sidebar for viewing document metadata.
 */
export class DocSidebar extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        const {meta} = this.props;

        if (! meta) {
            return <div/>;
        }

        return (

            <div className="p-1">

                <div style={{display: 'flex'}}>
                    <div className="ml-auto mr-auto">
                        {/*<DocThumbnail thumbnails={meta.thumbnails}*/}
                        {/*              maxWidth={300}*/}
                        {/*              maxHeight={300}*/}
                        {/*              persistenceLayerProvider={this.props.persistenceLayerProvider}/>*/}
                    </div>
                </div>

                <div className="text-xl p-1">
                    {meta.title || 'Untitled'}
                </div>

                <DocSidebar.Subtitle {...meta}/>

                <PropertyTable>
                    <PropertyTable.Row name="Added" value={meta.added}/>
                    <PropertyTable.Row name="Updated" value={meta.lastUpdated}/>
                    <PropertyTable.Row name="URL" value={meta.url}/>
                    <PropertyTable.Row name="DOI" value={meta.doi}/>
                    <PropertyTable.Row name="Year" value={meta.published ? ISODateTimeStrings.toISOYear(meta.published) : undefined}/>
                    <PropertyTable.Row name="Publisher" value={meta.publisher}/>
                    <PropertyTable.Row name="Authors" value={(meta.authors || []).map(current => current.displayName)}/>
                    {/*<PropertyTable.Row name="Tags" value={(meta.tags || []).map(current => current.label)}/>*/}
                </PropertyTable>

            </div>

        );

    }


    static Subtitle = class extends React.Component<DocMeta, any> {

        public render() {

            if (! this.props.subtitle) {
                return <div/>;
            }

            return (

                <div className="p-1 text-lg text-grey700">
                    {this.props.subtitle}
                </div>

            );

        }

    };

}

export interface DocMeta extends DocDetail {
    readonly lastUpdated?: ISODateTimeString;
    readonly thumbnails?: { [id: string]: IThumbnail };

}

interface IProps {
    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly meta?: DocMeta;
}

interface IState {

}


