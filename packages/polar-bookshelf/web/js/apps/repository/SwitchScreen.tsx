import * as React from 'react';

import {createStyles, makeStyles, Table, TableHead, TableRow, TableCell, Theme} from '@material-ui/core';

import { DocRepoTableToolbar } from '../../../../apps/repository/js/doc_repo/DocRepoTableToolbar';
import { useHistory } from 'react-router-dom';
import { useDocRepoStore } from '../../../../apps/repository/js/doc_repo/DocRepoStore2';

import { IDocInfo } from 'polar-shared/src/metadata/IDocInfo';
import { ISODateTimeStrings } from 'polar-shared/src/metadata/ISODateTimeStrings';

const useStyles = makeStyles<Theme>((theme) =>
    createStyles({
        root: {
            backgroundColor: theme.palette.background.default
        },
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
function toDate(ts: string | undefined): number {
    return ts ? ISODateTimeStrings.parse(ts).getTime() : 0;
}

export const SwitchScreen = () => {

    const classes = useStyles();
    const history = useHistory();

    const {data} = useDocRepoStore(['data']);
    function useDocInfos(){
        const docs = data.map(current => current.docInfo);
        return docs.sort((a: IDocInfo, b: IDocInfo)=>{
            return toDate(a.lastUpdated) - toDate(b.lastUpdated);
        })
    };
    const orderedTabsByRecency = useDocInfos();

    return (
        <>
            <DocRepoTableToolbar/>
            <Table  stickyHeader
                    style={{
                        minWidth: 0,
                        maxWidth: '100%',
                        tableLayout: 'fixed'
                    }}
                    aria-labelledby="tableTitle"
                    size={'medium'}
                    aria-label="enhanced table">

                    {orderedTabsByRecency.length > 0 ? 
                        <>
                            <TableHeader nonEmpty/>
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
        </>
    );
}