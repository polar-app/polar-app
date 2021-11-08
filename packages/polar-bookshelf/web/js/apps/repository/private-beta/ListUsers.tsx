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
import {Button, CircularProgress} from "@material-ui/core";
import {JSONRPC} from "../../../datastore/sharing/rpc/JSONRPC";
import {PrivateBetaReqCollection} from "polar-firebase/src/firebase/om/PrivateBetaReqCollection";
import IPrivateBetaReq = PrivateBetaReqCollection.IPrivateBetaReq;
import {EmailStr} from "polar-shared/src/util/Strings";
import {useDialogManager} from "../../../mui/dialogs/MUIDialogControllers";
import {IUserRecord} from "polar-firestore-like/src/IUserRecord";

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
    // Keep the list of displayed users in an array in state
    const [users, setUsers] = React.useState<ReadonlyArray<IPrivateBetaReq>>([]);

    // Keep the list of users who are "being accepted" in a temporary array in state, while they are processed
    const [usersBeingProcessed, setUsersBeingProcessed] = React.useState<ReadonlyArray<string>>([]);

    const dialogManager = useDialogManager();

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        (async () => {
            try {
                type Response = {
                    readonly list: ReadonlyArray<PrivateBetaReqCollection.IPrivateBetaReq>,
                }
                const response = await JSONRPC.exec<{}, Response>('private-beta/users', {});
                setUsers(response.list);
            } catch (e) {
                console.error(e);
                dialogManager.snackbar({
                    type: "error",
                    message: "Failed to fetch list of waiting users",
                })
            }
        })();
    }, [dialogManager]);

    /**
     * Return a stringified version of an array of Referral codes for the given waiting user
     * Remove duplicates and remove "system" tags
     */
    const stringifyReferralCodes = (waitingUser: PrivateBetaReqCollection.IPrivateBetaReq) => {
        // eslint-disable-next-line functional/prefer-readonly-type
        const tags: string[] = [];
        waitingUser.tags.forEach(tag => {
            if (!tags.includes(tag) && tag !== 'initial_signup') {
                tags.push(tag);
            }
        })
        return tags.join(', ');
    };

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

    async function acceptUser(email: EmailStr) {
        try {
            // Push this email to the array of users being processed now, so the UI shows a spinner on his row
            setUsersBeingProcessed([
                ...usersBeingProcessed,
                email,
            ]);

            type Request = {
                readonly emails: ReadonlyArray<string>,
            };
            type Response = {
                readonly accepted: ReadonlyArray<IUserRecord>,
            };

            // Accept this user
            const path = 'private-beta/accept-users';
            const request = {emails: [email]};
            await JSONRPC.exec<Request, Response>(path, request);

            // Remove user from the list in the frontend
            // He was already removed from DB as part of the API call anyway,
            // but a full list refresh might be an expensive operation
            setUsers(users.filter(user => user.email !== email));

            // Notify admin that the operation succeeded
            showSuccessSnackbar();
        } catch (e) {
            console.error('Waiting user failed to be accepted');
            console.error(e);

            // Notify admin that the operation failed
            showErrorSnackbar();
        }
    }

    function isBeingAcceptedNow(email: EmailStr) {
        return usersBeingProcessed.includes(email);
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
                                    {stringifyReferralCodes(waitingUser)}
                                </TableCell>
                                <TableCell align="right">
                                    <ButtonGroup variant="contained" color="primary"
                                                 aria-label="contained primary button group">
                                        {isBeingAcceptedNow(waitingUser.email) &&
                                        <Button><CircularProgress size={14}/> &nbsp; Accepting...</Button>}
                                        {!isBeingAcceptedNow(waitingUser.email) &&
                                        <Button onClick={() => acceptUser(waitingUser.email).then()}>Accept</Button>}
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
