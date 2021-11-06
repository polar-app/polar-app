import React, {useEffect} from 'react';
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
import {JSONRPC} from "../../../datastore/sharing/rpc/JSONRPC";
import {PrivateBetaReqCollection} from "polar-firebase/src/firebase/om/PrivateBetaReqCollection";
import IPrivateBetaReq = PrivateBetaReqCollection.IPrivateBetaReq;

const useStyles = makeStyles({
    container: {
        padding: '2em',
    },
    table: {
        minWidth: 650,
    }
});

export const ListUsers: React.FC = () => {
    const classes = useStyles();
    const [users, setUsers] = React.useState<ReadonlyArray<IPrivateBetaReq>>([]);

    useEffect(() => {
        JSONRPC.exec<unknown, {
            users: ReadonlyArray<IPrivateBetaReq>,
        }>('private-beta/users', {}).then(response => {
            setUsers(response.users);
        });
    }, []);

    return (
        <div className={classes.container}>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell>Registered at</TableCell>
                            <TableCell>Invite code</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((waitingUser) => (
                            <TableRow key={waitingUser.email}>
                                <TableCell component="th" scope="row">
                                    {waitingUser.email}
                                </TableCell>
                                <TableCell>
                                    {new Date(waitingUser.created).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    {waitingUser.tags.join(', ')}
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
