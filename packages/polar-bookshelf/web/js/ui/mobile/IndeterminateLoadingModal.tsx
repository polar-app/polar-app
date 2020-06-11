import * as React from 'react';
import {SnapshotSubscribers} from "../../firebase/SnapshotSubscribers";
import {DataLoader} from "../data_loader/DataLoader";
import {PageTransition} from '../motion/PageTransition';
import {ReviewerDialog} from "../../../../apps/repository/js/reviewer/ReviewerDialog";
import CircularProgress from "@material-ui/core/CircularProgress";

interface IProps {

    readonly id: string;

    readonly title?: string;

    readonly description?: string;

    /**
     * The component that provides a rendered element
     */
    readonly provider: () => Promise<JSX.Element>;
}

// FIXME: write a new AsyncLoading component that takes function call,
// which returns a promise... that will display a loading progress widget,
// then it calls the component with the properties we have received.

const Loading = (props: IProps) => (

    <ReviewerDialog>
        <PageTransition>

            <div style={{
                     display: 'flex'
                 }}>
                <div className="ml-auto mr-auto text-center"
                     style={{
                         maxWidth: '350px',
                         width: '350px'
                     }}>

                    <CircularProgress style={{
                                           margin: 'auto',
                                           width: '75px',
                                           height: '75px',
                                      }}/>

                    <h2 className="text-muted mt-2">
                        LOADING
                    </h2>

                    <p className="text-grey400 text-lg">
                        One moment.  Doing some cool computational stuff.
                    </p>

                </div>
            </div>

        </PageTransition>
    </ReviewerDialog>

);

export const IndeterminateLoadingModal = (props: IProps) => {

    const subscriber = SnapshotSubscribers.createFromAsyncProvider(props.provider);

    const render = (element: JSX.Element | undefined) => {

        if (element) {
            return element;
        }

        return <Loading {...props}/>;

    };

    return (
        <DataLoader id={props.id}
                    provider={subscriber}
                    render={element => render(element)}/>
    );

};
