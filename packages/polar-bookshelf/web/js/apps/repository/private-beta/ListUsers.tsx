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
import {Button, CircularProgress, TableSortLabel} from "@material-ui/core";
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

    // Which column to sort by?
    type SORTABLE_COLUMNS = 'created_at' | 'invite_code';
    const [sortBy, setSortBy] = React.useState<SORTABLE_COLUMNS>('created_at');
    const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');

    // Keep the list of users who are "being accepted" in a temporary array in state, while they are processed
    const [usersBeingProcessed, setUsersBeingProcessed] = React.useState<ReadonlyArray<string>>([]);

    const dialogManager = useDialogManager();

    const reloadUsersList = React.useCallback(async () => {
        setUsers([]);

        try {
            type Response = {
                readonly list: PrivateBetaReqCollection.IPrivateBetaReq[],
            }
            type ErrorResponse = {
                error: string,
            }

            const response = await JSONRPC.exec<{}, Response | ErrorResponse>('private-beta/users', {});

            if ('error' in response) {
                console.error(response);
                dialogManager.snackbar({
                    type: "error",
                    message: response.error,
                });
                return;
            }

            switch (sortBy) {
                case "created_at":
                    response.list.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
                    break;
                case "invite_code":
                    response.list.sort((a, b) => {
                        const aTags = stringifyReferralCodes(a);
                        const bTags = stringifyReferralCodes(b);
                        if (aTags < bTags) return -1;
                        return aTags > bTags ? 1 : 0;
                    });
                    break;
            }
            if (sortDirection === 'desc') {
                response.list.reverse();
            }
            setUsers(response.list);
        } catch (e: any) {
            console.error(JSON.stringify(e, null, 2));
            if (e.error?.error) {
                dialogManager.snackbar({
                    type: "error",
                    message: "Failed to fetch list of waiting users: " + e.error.error,
                });
                return;
            }
            dialogManager.snackbar({
                type: "error",
                message: "Failed to fetch list of waiting users",
            })
        }
    }, [dialogManager, sortBy, sortDirection]);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        reloadUsersList().then();
    }, [dialogManager, sortBy, sortDirection, reloadUsersList]);

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

            type Request = { readonly emails: ReadonlyArray<string> };
            type Response = { readonly accepted: ReadonlyArray<IUserRecord> };

            // Accept this user
            await JSONRPC.exec<Request, Response>('private-beta/accept-users', {emails: [email]});

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

    const columnClicked = React.useCallback((columnName: SORTABLE_COLUMNS) => {
        setSortBy(columnName);

        // If sort column has changed, always enforce descending order first
        if (sortBy !== columnName) {
            setSortDirection('desc');
            return;
        }
        // Reverse column sorting direction
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    }, [sortBy, sortDirection]);

    return (
        <div className={classes.container}>
            <h1>Manage waiting users</h1>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Email {users.length > 0 && `(${users.length} users)`}</TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortBy === 'created_at'}
                                    direction={sortDirection}
                                    onClick={() => columnClicked('created_at')}>Registered at</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortBy === 'invite_code'}
                                    direction={sortDirection}
                                    onClick={() => columnClicked('invite_code')}>Referral code</TableSortLabel>
                            </TableCell>
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
                                            <Button
                                                onClick={() => acceptUser(waitingUser.email).then()}>Accept</Button>}
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
