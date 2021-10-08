import * as React from 'react';

import {createStyles, makeStyles, Table, TableHead, TableRow, TableCell, Theme} from '@material-ui/core';
import {arrayStream} from "polar-shared/src/util/ArrayStreams";

import { useSideNavStore } from '../../../../web/js/sidenav/SideNavStore';
import { DocRepoTableToolbar } from '../../../../apps/repository/js/doc_repo/DocRepoTableToolbar';
import { useHistory } from 'react-router-dom';
import { useDocRepoStore } from '../../../../apps/repository/js/doc_repo/DocRepoStore2';
import { IDocInfo } from 'polar-shared/src/metadata/IDocInfo';

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
                        <span className={classes.headerFont}>Recently opened documents:</span>
                        :
                        <span className={classes.headerFont}>No files opened recently</span>
                    }
                </TableCell>
            </TableRow>
        </TableHead>
    );
}
/**
 * 
 * @returns 
 */
export const SwitchScreen = () => {
    
    const classes = useStyles();
    const history = useHistory();

    // const {tabs} = useSideNavStore(['tabs']);

    // const getRecentDocs = React.useCallback(() => {

    //     return arrayStream(tabs).sort((a,b) => a.lastActivated.localeCompare(b.lastActivated)).reverse().collect();

    // }, [tabs]);

    const {data} = useDocRepoStore(['data']);

    function useDocInfos(){

        const docs = data.map(current => current.docInfo);
        return docs.sort((a: any, b: any)=>{
            return a.lastUpdated && b.lastUpdated && a.lastUpdated.localeCompare(b.lastUpdated);
        })
    };

    const orderedTabsByRecency = useDocInfos();
    // const docs = useDocInfos();
    console.log(orderedTabsByRecency);
    
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
                            {/* {orderedTabsByRecency.map( column =>
                                <TableRow onClick={()=>history.push(column.url)}>
                                    <TableCell key={column.id} className={classes.th}>
                                        {column.title}
                                    </TableCell>
                                </TableRow>
                            )} */}
                        </>
                        :
                        <TableHeader/>
                    }
            </Table>                
        </>
    );
}