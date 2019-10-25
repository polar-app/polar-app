import * as React from 'react';
import {RepoAnnotation} from '../../RepoAnnotation';
import {IStyleMap} from '../../../../../web/js/react/IStyleMap';
import Moment from 'react-moment';
import {FormattedTags} from '../../FormattedTags';
import Button from 'reactstrap/lib/Button';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";

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
        verticalAlign: 'top'
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

            <div style={Styles.metaTable}>

                <div style={Styles.metaTableRow}>
                    <div style={Styles.metaField}>Created</div>

                    <div style={Styles.metaValue}>

                        <Moment withTitle={true}
                                titleFormat="D MMM YYYY hh:MM A"
                                format="MMM DD YYYY HH:mm A"
                                filter={(value) => value.replace(/^an? /g, '1 ')}>
                            {repoAnnotation.created}
                        </Moment>

                        <div style={Styles.relativeTime}>

                            (

                            <Moment withTitle={true}
                                    titleFormat="D MMM YYYY hh:MM A"
                                    fromNow>
                                {repoAnnotation.created}
                            </Moment>

                            )

                        </div>

                    </div>

                </div>

                <div style={Styles.metaTableRow}>

                    <div style={Styles.metaField}>Tags</div>

                    <div style={Styles.metaValue}>

                        <FormattedTags tags={repoAnnotation.tags || {}}/>

                    </div>

                </div>

                <div style={Styles.metaTableRow}>

                    <div style={Styles.metaField}>Type</div>

                    <div style={Styles.metaValue}>

                        {repoAnnotation.type}

                    </div>

                </div>

                <div style={Styles.metaTableRow}>

                    <div style={Styles.metaField}>Doc</div>

                    <div style={Styles.metaValue}>

                        {/*TODO: make this into a TextLink component*/}

                        <Button onClick={() => this.props.onDocumentLoadRequested(repoAnnotation.docInfo)}
                                style={{whiteSpace: 'normal', textAlign: 'left'}}
                                className="p-0"
                                size="sm"
                                color="link">

                            {repoAnnotation.docInfo.title}

                        </Button>

                    </div>

                </div>

            </div>

        );

    }


}

export interface IProps {
    readonly repoAnnotation: RepoAnnotation;
    readonly onDocumentLoadRequested: (docInfo: IDocInfo) => void;
}

export interface IState {

}

