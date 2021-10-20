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
        },
        row: {
            "& th": {
                paddingTop: theme.spacing(1),
                paddingBottom: theme.spacing(1),
                paddingLeft: 0,
                paddingRight: 0,
                borderCollapse: 'collapse',
                lineHeight: '1em'
            }
        },
        headerFont:{
            fontSize: '1.2em'
        }
    })
);
interface TableHeaderProps {
    readonly nonEmpty?: boolean;
}

const TableHeader = (props: TableHeaderProps) => {
    const classes = useStyles();

    return(
        <TableHead>
            <TableRow>
                <TableCell width="auto">
                    { ! props.nonEmpty && (
                        <span className={classes.headerFont}>No recent files</span>
                    )}
                </TableCell>
            </TableRow>
        </TableHead>
    );
}
function toDate(ts: string | undefined): number {
    return ts ? ISODateTimeStrings.parse(ts).getTime() : 0;
}


function useSortedDocInfos() {

    const {data} = useDocRepoStore(['data']);

    const docs = data.map(current => current.docInfo);

    return docs.sort((a: IDocInfo, b: IDocInfo)=>{
        return toDate(a.lastUpdated) - toDate(b.lastUpdated);
    });

}

export const SwitchScreen = () => {

    const classes = useStyles();
    const history = useHistory();

    const orderedTabsByRecency = useSortedDocInfos();

    return (
        <AdaptivePageLayout title="Recent Documents" fullWidth noBack>

            <Table  style={{
                    }}
                    aria-labelledby="tableTitle"
                    aria-label="enhanced table">

                    {orderedTabsByRecency.length > 0 ?
                        <>
                            {orderedTabsByRecency.map( column =>
                                <TableRow key={column.uuid} onClick={()=>history.push('/doc/'+column.fingerprint)}>
                                    <TableCell key={column.uuid} className={classes.th} width="auto">
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
