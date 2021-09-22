import * as React from 'react';

import {createStyles, makeStyles, Table, TableHead, TableRow, TableCell, Theme} from '@material-ui/core';
import {arrayStream} from "polar-shared/src/util/ArrayStreams";

import { useSideNavStore } from '../../../../web/js/sidenav/SideNavStore';
import { DocRepoTableToolbar } from '../../../../apps/repository/js/doc_repo/DocRepoTableToolbar';
import { useHistory } from 'react-router-dom';

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
    })
);

export const SwitchScreen = () => {
    
    const classes = useStyles();
    const history = useHistory();

    const {tabs} = useSideNavStore(['tabs']);

    const getRecentDocs = React.useCallback(() => {

        return arrayStream(tabs).sort((a,b) => a.lastActivated.localeCompare(b.lastActivated)).reverse().collect();

    }, [tabs]);

    const orderedTabsByRecency = getRecentDocs();
    
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

                <TableHead className={classes.root}>
                    {orderedTabsByRecency.length > 0 ? 
                        orderedTabsByRecency.map( column =>
                            <TableRow onClick={()=>history.push(column.url)}>
                                <TableCell key={column.id} className={classes.th}>
                                    {column.title}
                                </TableCell>
                            </TableRow>
                            )
                        :
                        <TableRow>
                            <TableCell>
                                <span>No files opened recently</span>
                            </TableCell>
                        </TableRow>
                    }
                </TableHead>   
            </Table>                
        </>
    );
}