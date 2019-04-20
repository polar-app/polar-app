import * as React from 'react';
import {Logger} from '../../../../web/js/logger/Logger';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {SplashLifecycle} from './SplashLifecycle';

const log = Logger.create();

/**
 * This is a basic algorithm for displaying splashes which is designed to be
 * easy to manage / debug until we bring on something more sophisticated.
 *
 * This algorithm is generally very simple.
 *
 * - check if we have to display 'what's new' by seeing if the version number
 *   has incremented.
 *
 *    - if it has, display the what's new and have a timeout before we display
 *      the next message.
 *
 *    -
 *
 * - determine which additional splash to display:
 *
 *    - net-promoter-score must come first and we should only display it once
 *      per week
 *
 *    - Then, 24 hours later, should come a text prompt asking for the users
 *      feedback to improve polar.  Ask these separately spaced apart so we
 *      don't get latency.
 *
 *    - I think this should eventually be implemented via a more complex rules
 *      engine but these systems are complicated and might take 2-4 days to find
 *      one and implement that we actually like.
 *
 */
export class Splashes extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            lastUpdated: 0
        };

        this.doUpdate()
            .catch(err => log.error("Unable to update: ", err));

    }

    public render() {

        return <div/>;

    }

    private async doUpdate() {

        try {

            const persistenceLayer = await this.props.persistenceLayerManager.getAsync();

            const datastore = persistenceLayer.datastore;

            const datastoreOverview = await datastore.overview();

            if (datastoreOverview) {

                const userState = {
                    datastoreCreated: datastoreOverview.created
                };

            }

        } finally {
            this.scheduleNextUpdate();
        }

    }

    private handleFirstUpdate() {

    }

    private scheduleNextUpdate() {
        //
        // const delay = SplashLifecycle.computeDelay();
        //
        //
        // log.debug("Scheduling next updated: ", {delay, effectiveDelay});
        //
        // setTimeout(() => {
        //
        //     this.doUpdate()
        //         .catch(err => log.error("Unable to do update: ", err));
        //
        // }, effectiveDelay);

    }

}

interface IProps {
    readonly persistenceLayerManager: PersistenceLayerManager;
}

interface IState {

}


