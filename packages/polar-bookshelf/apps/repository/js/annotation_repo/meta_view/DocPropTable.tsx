import * as React from 'react';
import {IStyleMap} from '../../../../../web/js/react/IStyleMap';
import {FormattedTags} from '../../FormattedTags';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {IDocAnnotation} from "../../../../../web/js/annotation_sidebar/DocAnnotation";
import Button from '@material-ui/core/Button';

const Styles: IStyleMap = {

    metaTable: {
        display: 'table'
    },

    metaTableRow: {
        display: 'table-row'
    },

    metaField: {
        display: 'table-cell',
        // fontWeight: 'bold',
        color: 'var(--secondary)',
        marginRight: '10px',
    },

    metaValue: {
        paddingLeft: '5px',
        display: 'table-cell',
        verticalAlign: 'top'
    },

    annotationText: {
        paddingTop: '5px'
    },

    relativeTime: {
        marginLeft: '5px',
        color: 'var(--secondary)',
        display: 'inline'
    }

};

export class DocPropTable extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        const {repoAnnotation} = this.props;

        return (

            <div>
                <div style={Styles.metaTable}>

                    {/*<div style={Styles.metaTableRow}>*/}
                    {/*    <div style={Styles.metaField}>Created</div>*/}

                    {/*    <div style={Styles.metaValue}>*/}

                    {/*        <Moment withTitle={true}*/}
                    {/*                titleFormat="D MMM YYYY hh:MM A"*/}
                    {/*                format="MMM DD YYYY HH:mm A"*/}
                    {/*                filter={(value) => value.replace(/^an? /g, '1 ')}>*/}
                    {/*            {repoAnnotation.created}*/}
                    {/*        </Moment>*/}

                    {/*        <div style={Styles.relativeTime}>*/}

                    {/*            (*/}

                    {/*            <Moment withTitle={true}*/}
                    {/*                    titleFormat="D MMM YYYY hh:MM A"*/}
                    {/*                    fromNow>*/}
                    {/*                {repoAnnotation.created}*/}
                    {/*            </Moment>*/}

                    {/*            )*/}

                    {/*        </div>*/}

                    {/*    </div>*/}

                    {/*</div>*/}

                    <div style={Styles.metaTableRow}>

                        <div style={Styles.metaField}>Type</div>

                        <div style={Styles.metaValue}>

                            {repoAnnotation.annotationType}

                        </div>

                    </div>

                    <div style={Styles.metaTableRow}>

                        <div style={Styles.metaField}>Doc</div>

                        <div style={Styles.metaValue}>

                            {/*TODO: make this into a TextLink component*/}

                            {repoAnnotation.docInfo.title}

                        </div>

                    </div>

                </div>

                <div className="mt-auto mb-auto mt-1">
                    <FormattedTags tags={repoAnnotation.tags || {}}/>
                </div>

            </div>

        );

    }


}

export interface IProps {
    readonly repoAnnotation: IDocAnnotation;
    readonly onDocumentLoadRequested: (docInfo: IDocInfo) => void;
}

export interface IState {

}

