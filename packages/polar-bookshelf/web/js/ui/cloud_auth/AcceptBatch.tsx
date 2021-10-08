import {Button, CircularProgress} from "@material-ui/core";
import React from "react";
import {JSONRPC} from "../../datastore/sharing/rpc/JSONRPC";

interface IAcceptedUser {
    uid: string,
    email: string,
}

export const AcceptBatch = function AcceptBatch() {
    const [acceptedUsers, setAcceptedUsers] = React.useState<IAcceptedUser[]>([]);
    const [isAcceptInProgress, setIsAcceptInProgress] = React.useState<boolean>(false);

    if (isAcceptInProgress) {
        return <><br/><br/>
            <div><CircularProgress/></div>
        </>;
    }

    return <div>
        <br/>
        <Button color="secondary"
                variant="contained"
                size="large"
                onClick={() => {
                    // Show spinner
                    setIsAcceptInProgress(true);

                    JSONRPC
                        .exec<{}, {
                            accepted: IAcceptedUser[],
                        }>('private-beta/accept-batch', {})
                        .then(value => {
                            console.log(value);
                            setAcceptedUsers(value.accepted);
                        })
                        // Hide spinner
                        .finally(() => setIsAcceptInProgress(false));
                }}>Accept next waiting users batch</Button>
        <br/>

        {!!acceptedUsers.length && <div>
            <p>Accepted users:</p>
            <ul>
                {acceptedUsers.map((value, index) => {
                    return <li key={index}>{value.email}</li>;
                })}
            </ul>
        </div>}
    </div>;
}
