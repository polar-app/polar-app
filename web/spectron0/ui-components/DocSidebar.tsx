import * as React from 'react';
import {DocDetail} from "../../js/metadata/DocDetail";
import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {PropertyTable} from "./PropertyTable";
import {Tag} from "polar-shared/src/tags/Tags";

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

        return (

            <div className="p-1">

                <div className="text-xl p-1">
                    {this.props.title || 'Untitled'}
                </div>

                <DocSidebar.Subtitle {...this.props}/>

                <PropertyTable>
                    <PropertyTable.Row name="Added" value={this.props.added}/>
                    <PropertyTable.Row name="Updated" value={this.props.updated}/>
                    <PropertyTable.Row name="URL" value={this.props.url}/>
                    <PropertyTable.Row name="DOI" value={this.props.doi}/>
                    <PropertyTable.Row name="Year" value={this.props.published ? ISODateTimeStrings.toISOYear(this.props.published) : undefined}/>
                    <PropertyTable.Row name="Publisher" value={this.props.publisher}/>
                    <PropertyTable.Row name="Authors" value={(this.props.authors || []).map(current => current.displayName)}/>
                    <PropertyTable.Row name="Tags" value={(this.props.tags || []).map(current => current.label)}/>
                </PropertyTable>

            </div>

        );

    }


    static Subtitle = class extends React.Component<IProps, any> {

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

interface IProps extends DocDetail {
    readonly updated: ISODateTimeString;
    readonly tags?: ReadonlyArray<Tag>;
}

interface IState {

}


