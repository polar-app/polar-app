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
import {EmailStr} from "polar-shared/src/util/Strings";
import {useDialogManager} from "../../../mui/dialogs/MUIDialogControllers";

const useStyles = makeStyles({
    container: {
        paddingLeft: '2em',
        paddingRight: '2em',
    },
    table: {
        minWidth: 650,
    }
});

const NoUsersComponent: React.FC = (props) => {
    return <TableRow>
        <TableCell component="th" scope="row">
            Loading users...
        </TableCell>
        <TableCell>&nbsp;</TableCell>
        <TableCell>&nbsp;</TableCell>
        <TableCell>&nbsp;</TableCell>
    </TableRow>;
};

export const ListUsers: React.FC = (ref) => {
    const classes = useStyles();
    const [users, setUsers] = React.useState<ReadonlyArray<IPrivateBetaReq>>([]);

    useEffect(() => {
        JSONRPC.exec<unknown, {
            list: ReadonlyArray<IPrivateBetaReq>,
        }>('private-beta/users', {}).then(response => {
            console.log(response);
            setUsers(response.list);
        }).catch((err) => {
            console.error(err);
        })
    }, []);

    function formatTags(waitingUser: PrivateBetaReqCollection.IPrivateBetaReq) {
        const tags: string[] = [];
        waitingUser.tags.forEach(tag => {
            if (!tags.includes(tag) && tag !== 'initial_signup') {
                tags.push(tag);
            }
        })
        return tags.join(', ');
    }

    const dialogManager = useDialogManager();

    const showSuccessSnackbar = React.useCallback(() => {
        dialogManager.snackbar({
            type: "success",
            message: "User accepted",
        })
    }, [dialogManager]);

    const showErrorSnackbar = React.useCallback(() => {
        dialogManager.snackbar({
            type: "error",
            message: "User failed to be accepted",
        })
    }, [dialogManager]);

    function acceptUser(email: EmailStr) {
        type AcceptUserRequest = {
            emails: EmailStr[],
        };
        type AcceptUserResponse = {
            accepted: ReadonlyArray<any>,
        };
        JSONRPC.exec<AcceptUserRequest, AcceptUserResponse>('private-beta/accept-users', {emails: [email]}).then(() => {
            // Remove user from the list in the fronted
            // He was already removed from DB as part of the API call anyway but a full list refresh might be expensive
            setUsers(users.filter(user => user.email != email));
            showSuccessSnackbar();
            console.log('User accepted');
        }).catch((err) => {
            console.error('Waiting user failed to be accepted');
            console.error(err);
            showErrorSnackbar();
        })
    }

    return (
        <div className={classes.container}>
            <h1>Manage waiting users</h1>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Email {users.length > 0 && `(${users.length} users)`}</TableCell>
                            <TableCell>Registered at</TableCell>
                            <TableCell>Invite code</TableCell>
                            <TableCell align="right">&nbsp;</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {!users.length && <NoUsersComponent/>}

                        {users.map((waitingUser) => (
                            <TableRow key={waitingUser.email}>
                                <TableCell component="th" scope="row">
                                    {waitingUser.email}
                                </TableCell>
                                <TableCell>
                                    {new Date(waitingUser.created).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    {formatTags(waitingUser)}
                                </TableCell>
                                <TableCell align="right">
                                    <ButtonGroup variant="contained" color="primary"
                                                 aria-label="contained primary button group">
                                        <Button onClick={() => acceptUser(waitingUser.email)}>Accept</Button>
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
