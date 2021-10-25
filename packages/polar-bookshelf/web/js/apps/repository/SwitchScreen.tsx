import * as React from 'react';
import {createStyles, makeStyles, Table, TableCell, TableHead, TableRow, Theme} from '@material-ui/core';
import {useHistory} from 'react-router-dom';
import {useDocRepoStore} from '../../../../apps/repository/js/doc_repo/DocRepoStore2';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {AdaptivePageLayout} from "../../../../apps/repository/js/page_layout/AdaptivePageLayout";

const useStyles = makeStyles<Theme>((theme) =>
    createStyles({
        th: {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 0
        },
        headerFont:{
            fontSize: '1.2em'
        }
    })
);
interface TableHeaderProps {
    readonly nonEmpty?: boolean;
}
/**
 *
 * @param props a blooean variable to determine if there was any recently opened documents or not
 * @returns returns the approprite header title
 */
const TableHeader = (props: TableHeaderProps) => {
    const classes = useStyles();

    return(
        <TableHead>
            <TableRow>
                <TableCell>
                    { props.nonEmpty ?
                        <span className={classes.headerFont}>Recently Updated Documents:</span>
                        :
                        <span className={classes.headerFont}>No recent files</span>
                    }
                </TableCell>
            </TableRow>
        </TableHead>
    );
}

function docInfoComparator(a: IDocInfo, b: IDocInfo) {

    function toDate(ts: string | undefined): number {
        return ts ? ISODateTimeStrings.parse(ts).getTime() : 0;
    }

    function docInfoToDate(docInfo: IDocInfo): number {
        return Math.max(toDate(docInfo.lastUpdated), toDate(docInfo.added));
    }

    return docInfoToDate(b) - docInfoToDate(a);
}

function useSortedDocInfos() {

    const {data} = useDocRepoStore(['data']);

    const docs = data.map(current => current.docInfo);

    return docs.sort(docInfoComparator);

}

export const SwitchScreen = () => {

    const classes = useStyles();
    const history = useHistory();

    const orderedTabsByRecency = useSortedDocInfos();

    return (
        <AdaptivePageLayout title="Recent Documents" fullWidth noBack>

            <Table  style={{width: '100%'}}
                    aria-labelledby="tableTitle"
                    aria-label="enhanced table">

                    {orderedTabsByRecency.length > 0 ?
                        <>
                            {orderedTabsByRecency.map( column =>
                                <TableRow key={column.uuid} onClick={()=>history.push('/doc/'+column.fingerprint)}>
                                    <TableCell key={column.uuid} className={classes.th}>
                                        {column.title}
                                    </TableCell>
                                </TableRow>
                            )}
                        </>
                        :
                        <TableHeader/>
                    }
            </Table>
        </AdaptivePageLayout>
    );
}
