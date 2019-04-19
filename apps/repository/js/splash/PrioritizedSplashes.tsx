import * as React from 'react';
import {Logger} from '../../../../web/js/logger/Logger';
import {PrioritizedComponentManager, PrioritizedComponentRef} from '../../../../web/js/ui/prioritized/PrioritizedComponentManager';
import {WhatsNewRef} from './splashes/whats_new/WhatsNewRef';
import {SurveyRef} from './splashes/survey/SurveyRef';
import {PremiumRef} from './splashes/premium/PremiumRef';
import {ChromeExtensionReviewRef} from './splashes/chrome_extension_review/ChromeExtensionReviewRef';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {DatastoreOverview} from '../../../../web/js/datastore/Datastore';
import {Provider, Providers} from '../../../../web/js/util/Providers';
import {TimeDurations} from '../../../../web/js/util/TimeDurations';
import {AlternativeToReviewRef} from './splashes/alternativeto_review/AlternativeToReviewRef';
import {DistConfig} from '../../../../web/js/dist_config/DistConfig';
import {NPSRef} from './splashes/nps/NPSRef';
import {CrowdfundingRef} from './splashes/crowdfunding/CrowdfundingRef';

const log = Logger.create();

const prioritizedComponentRefs: PrioritizedComponentRef[] = [
    // new JoinDiscordRef(),
    new WhatsNewRef(),
    new CrowdfundingRef(),
    new NPSRef(),
    // new GithubStarsRef(),
    // new SurveyRef(),
    new ChromeExtensionReviewRef(),
    new AlternativeToReviewRef(),
];

if (DistConfig.ENABLE_PURCHASES) {
    prioritizedComponentRefs.push(new PremiumRef());
}

export class PrioritizedSplashes extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            lastUpdated: 0
        };

        this.doUpdate();

    }

    public render() {

        if (this.state.datastoreOverview) {

            return (
                <PrioritizedComponentManager prioritizedComponentRefs={prioritizedComponentRefs}
                                             datastoreOverview={this.state.datastoreOverview}/>
            );

        } else {
            return <div/>;
        }

    }

    private doUpdate() {

        this.props.persistenceLayerManager.addEventListener(event => {

            if (event.state === 'changed') {

                const persistenceLayer = this.props.persistenceLayerManager.get();

                const datastore = persistenceLayer.datastore;

                datastore.overview()
                    .then(datastoreOverview => {

                        if (datastoreOverview) {

                            this.setState({
                                datastoreOverview,
                                lastUpdated: Date.now()
                            });

                            log.info("Datastore overview updated");

                        }

                        this.scheduleNextUpdate();

                    })
                    .catch(err => {
                        log.error("Unable to get datastore overview: ", err);
                        this.scheduleNextUpdate();
                    });

            }

        });

    }

    private scheduleNextUpdate() {

        // now do another update
        setTimeout(() => this.doUpdate(), TimeDurations.toMillis('15m'));

    }

}

interface IProps {
    readonly persistenceLayerManager: PersistenceLayerManager;
}

interface IState {
    readonly datastoreOverview?: DatastoreOverview;
    readonly lastUpdated: number;
}


