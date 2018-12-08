import * as React from 'react';
import ReactTable from "react-table";
import {Footer, Tips} from './Utils';
import {Logger} from '../../../web/js/logger/Logger';
import {DocLoader} from '../../../web/js/apps/main/ipc/DocLoader';
import {Strings} from '../../../web/js/util/Strings';
import {ListenablePersistenceLayer} from '../../../web/js/datastore/ListenablePersistenceLayer';
import {RepoDocInfoLoader} from './RepoDocInfoLoader';
import {AppState} from './AppState';
import {RepoDocInfo} from './RepoDocInfo';
import {RepoDocInfos} from './RepoDocInfos';
import {DocRepository} from './DocRepository';
import {TagInput} from './TagInput';
import {Optional} from '../../../web/js/util/ts/Optional';
import {Tag} from '../../../web/js/tags/Tag';
import {FilterTagInput} from './FilterTagInput';
import {AppProps} from './AppProps';
import {FilteredTags} from './FilteredTags';
import {isPresent} from '../../../web/js/Preconditions';
import {Sets} from '../../../web/js/util/Sets';
import {Tags} from '../../../web/js/tags/Tags';
import Moment from 'react-moment';
import {ISODateTimeString} from '../../../web/js/metadata/ISODateTimeStrings';

const log = Logger.create();

export class DateTimeTableCell extends React.Component<IProps, any> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        if (isPresent(this.props.datetime)) {

            return (

                <div className={this.props.className}>
                    <Moment withTitle={true}
                            titleFormat="D MMM YYYY hh:MM A"
                            filter={(value) => value.replace(/^an? /g, '1 ')}
                            fromNow ago>
                        {this.props.datetime!}
                    </Moment>
                </div>

            );

        } else {
            return null;
        }

    }

}

interface IProps {
    datetime: ISODateTimeString | null | undefined;
    className: string;
}
