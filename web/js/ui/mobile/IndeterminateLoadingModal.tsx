import * as React from 'react';
import {IndeterminateProgressBar} from "../progress_bar/IndeterminateProgressBar";
import {SnapshotSubscribers} from "../../firebase/SnapshotSubscribers";
import {DataLoader} from "../data_loader/DataLoader";
import {PageTransition} from '../motion/PageTransition';
import {Pulse} from '../motion/Pulse';
import {PolarSVGIcon} from '../svg_icons/PolarSVGIcon';
import {ReviewerDialog} from "../../../../apps/repository/js/reviewer/ReviewerDialog";

interface IProps {

    readonly id: string;

    readonly title?: string;

    readonly description?: string;

    /**
     * The component that provides a rendered element
     */
    readonly provider: () => Promise<JSX.Element>;
}

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

                    <Pulse>
                        <PolarSVGIcon/>
                    </Pulse>

                    <IndeterminateProgressBar/>

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
