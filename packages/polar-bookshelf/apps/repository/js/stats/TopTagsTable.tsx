import * as React from 'react';
import {DocInfoStatistics} from '../../../../web/js/metadata/DocInfoStatistics';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import StatTitle from './StatTitle';

export default class TopTagsTable extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        const topTags = DocInfoStatistics.computeTopTags(this.props.docInfos, 20);

        return <div id="top-tags-table">
            <StatTitle>Top Tags</StatTitle>
            <table>
                <tbody>
                    {topTags.map(topTag =>
                         <tr key={topTag.key}>
                             <td className="pt-1 pb-1">{topTag.key}</td>
                             <td className="pt-1 pb-1">{topTag.value}</td>
                         </tr>)}

                </tbody>
            </table>
        </div>;
    }

}

export interface IProps {
    readonly docInfos: ReadonlyArray<IDocInfo>;
}

export interface IState {

}
