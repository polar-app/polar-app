import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {Button} from "@material-ui/core";

const useStyles = makeStyles({
    container: {
        padding: '2em',
    },
    table: {
        minWidth: 650,
    }
});

function createData(email: string, created_at: number) {
    return {email, created_at};
}

const rows = [
    createData('elon.musk@example.com', new Date().getTime()),
    createData('bill.gates@example.com', new Date().getTime()),
    createData('satoshi.nakamoto@example.com', new Date().getTime()),
];

export const ListUsers: React.FC = () => {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell>Registered at</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.email}>
                                <TableCell component="th" scope="row">
                                    {row.email}
                                </TableCell>
                                <TableCell>
                                    {new Date(row.created_at).toLocaleString()}
                                </TableCell>
                                <TableCell align="right">
                                    <ButtonGroup variant="contained" color="primary"
                                                 aria-label="contained primary button group">
                                        <Button>Accept</Button>
                                    </ButtonGroup>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}
