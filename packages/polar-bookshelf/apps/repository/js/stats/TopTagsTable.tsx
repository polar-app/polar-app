import * as React from 'react';
import {DocInfoStatistics} from '../../../../web/js/metadata/DocInfoStatistics';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import StatTitle from './StatTitle';
import isEqual from 'react-fast-compare';


export interface IProps {
    readonly docInfos: ReadonlyArray<IDocInfo>;
}

export const TopTagsTable = React.memo(function TopTagsTable(props: IProps) {

    const topTags = DocInfoStatistics.computeTopTags(props.docInfos, 20);

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

}, isEqual);
