import React, {useContext, useState} from 'react';
import {createContextMemo, useContextMemo} from "../../js/react/ContextMemo";
import isEqual from "react-fast-compare";
import Button from "@material-ui/core/Button";

interface AcceptedInvitations {
    readonly alice: boolean;
    readonly bob: boolean;
    readonly carol: boolean;
}

const initialAcceptedInvitations: AcceptedInvitations = {
    alice: true,
    bob: true,
    carol: true
}

const AcceptedInvitationsContext
    = createContextMemo<AcceptedInvitations>(initialAcceptedInvitations)

// const AcceptedInvitationsContext
//     = React.createContext<AcceptedInvitations>(initialAcceptedInvitations)

const LeafComponent = () => {

    console.log("LeafComponent: rendered");

    const acceptedInvitations = useContextMemo(AcceptedInvitationsContext);
    // const acceptedInvitations = useContext(AcceptedInvitationsContext);

    return (
        <div>
            {/*accepted invitations: {acceptedInvitations}*/}
            <br/>

            alice {acceptedInvitations.alice ? 'true' : 'false'}
            <br/>
            bob {acceptedInvitations.bob ? 'true' : 'false'}
            <br/>
            carol {acceptedInvitations.carol ? 'true' : 'false'}
            <br/>

        </div>
    );

}

const IntermediateComponent = React.memo(() => {

    console.log("IntermediateComponent: rendered");

    return <LeafComponent/>

}, isEqual)

const RootComponent = () => {

    // used to just trigger update from the root.
    const [iter, setIter] = useState(1);

    const [acceptedInvitations, setAcceptedInvitations] = useState(initialAcceptedInvitations);

    const toggleAlice = () => setAcceptedInvitations({...acceptedInvitations, alice: ! acceptedInvitations.alice});
    const toggleBob = () => setAcceptedInvitations({...acceptedInvitations, bob: ! acceptedInvitations.bob});
    const toggleCarol = () => setAcceptedInvitations({...acceptedInvitations, carol: ! acceptedInvitations.carol});

    return (
        <AcceptedInvitationsContext.Provider value={acceptedInvitations}>

            <div>
                iter: {iter} <br/>

                <Button variant="contained" onClick={() => setIter(iter +1)}>increase iter</Button>
                <Button variant="contained" onClick={toggleAlice}>toggle alice</Button>
                <Button variant="contained" onClick={toggleBob}>toggle bob</Button>
                <Button variant="contained" onClick={toggleCarol}>toggle carol</Button>

                <IntermediateComponent/>
            </div>

        </AcceptedInvitationsContext.Provider>
    )

}

export const ContextMemoTest = () => {

    return (
        <RootComponent/>
    );

}
