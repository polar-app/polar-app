import * as React from 'react';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import NewDocumentRateChart from './NewDocumentRateChart';
import TopTagsChart from './TopTagsChart';
import TopTagsTable from './TopTagsTable';
import {MessageBanner} from '../MessageBanner';
import {FixedNav, FixedNavBody} from '../FixedNav';
import {RepoHeader} from '../repo_header/RepoHeader';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import ReadingProgressTable from './ReadingProgressTable';
import {SpacedRepQueueChart} from "./SpacedRepQueueChart";
import {ReviewerTasks} from "../reviewer/ReviewerTasks";
import {Logger} from "polar-shared/src/logger/Logger";
import {PremiumFeature} from "../../../../web/js/ui/premium_feature/PremiumFeature";
import {Devices} from "../../../../web/js/util/Devices";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {RepoFooter} from "../repo_footer/RepoFooter";

const log = Logger.create();

export interface ReviewerStats {
    readonly isReviewer?: boolean;
}

const ReviewerStats = (props: ReviewerStats) => {

    if (props.isReviewer) {

        return <div>
            <SectionHeader>
                <h2>Flashcards</h2>

                <SectionText>
                    Stats for flashcard review including the queue length (amount of work needed to do
                    to catch up) and the number of flashcards completed.
                </SectionText>
            </SectionHeader>

            <div className="row mt-2">
                <div className="col-lg-12">
                    <SpacedRepQueueChart mode='flashcard' type='queue'/>
                </div>
            </div>

            <div className="row mt-2">
                <div className="col-lg-12">
                    <SpacedRepQueueChart mode='flashcard' type='completed'/>
                </div>
            </div>

            <SectionHeader>
                <h2>Incremental Reading</h2>

                <SectionText>
                    Stats regarding incremental reading.  Incremental reading uses spaced repetition along
                    with your annotations so you can easily review your notes in conjunction with your
                    flashcards.
                </SectionText>
            </SectionHeader>

            <div className="row mt-2">
                <div className="col-lg-12">
                    <SpacedRepQueueChart mode='reading' type='queue'/>
                </div>
            </div>

            <div className="row mt-2">
                <div className="col-lg-12">
                    <SpacedRepQueueChart mode='reading' type='completed'/>
                </div>
            </div>

        </div>

    }

    return <div/>

};

const SectionHeader = (props: any) => {
    return <div className="row mt-2">
        <div className="col">
            {props.children}
        </div>
    </div>;
};

const SectionText = (props: any) => {
    return <p className="text-lg text-grey700">
        {props.children}
    </p>;
};

export default class StatsScreen extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.getDocInfos = this.getDocInfos.bind(this);

        this.state = {
        };

    }

    public componentDidMount(): void {

        // TODO: we shouldn't use this I think as it's not supported well on modern react...

        ReviewerTasks.isReviewer()
            .then(isReviewer => this.setState({isReviewer}))
            .catch(err => log.error(err));

    }
    public render() {

        if (Devices.get() === 'phone') {
            return <StatsScreen.Phone {...this.props}/>
        } else {
            return <StatsScreen.Default {...this.props}/>
        }

    }

    private getDocInfos(): ReadonlyArray<IDocInfo> {
        return this.props.repoDocMetaManager.repoDocInfoIndex.values()
            .map(current => current.docInfo);
    }

    public static Phone = class extends StatsScreen {
        public render() {
            return <FixedNav id="doc-repository" className="statistics-view p-1">

                <header>

                    <RepoHeader persistenceLayerManager={this.props.persistenceLayerManager}/>

                    <MessageBanner/>

                </header>

                <FixedNavBody>
                    <ReviewerStats isReviewer={this.state.isReviewer}/>
                </FixedNavBody>

                <RepoFooter/>
            </FixedNav>
        }
    };

    public static Default = class extends StatsScreen {

        public render() {

            const docInfos = this.getDocInfos();

            return (

                <FixedNav id="doc-repository" className="statistics-view pb-2">

                    <header>

                        <RepoHeader persistenceLayerManager={this.props.persistenceLayerManager}/>

                        <MessageBanner/>

                    </header>

                    <FixedNavBody>

                        <div className="container mt-3">

                            <SectionHeader>
                                <h1>Statistics</h1>

                                <SectionText>
                                    Polar keeps track of statistics of your document repository so you can better understand
                                    your reading habits and what types of documents are stored in your repository.
                                </SectionText>
                            </SectionHeader>

                            <ReviewerStats isReviewer={this.state.isReviewer}/>

                            <SectionHeader>
                                <h2>Reading</h2>

                                <SectionText>
                                    Polar keeps track of your reading progress by counting pagemarks and number of pages
                                    you've read per day so you can focus setting a reading/study goal.
                                </SectionText>
                            </SectionHeader>

                            <div className="row mt-2">

                                <div className="col-lg-12">
                                    <PremiumFeature required='bronze' feature="statistics" size="lg">
                                        <ReadingProgressTable docInfos={docInfos}/>
                                    </PremiumFeature>
                                </div>

                            </div>


                            <SectionHeader>
                                <h2>Documents</h2>

                                <SectionText>
                                    Statistics on the number and type of documents you've added to your repository.
                                </SectionText>
                            </SectionHeader>

                            <div className="row mt-2">

                                <div className="col-lg-12">
                                    <PremiumFeature required='bronze' feature="statistics" size="lg">
                                        <NewDocumentRateChart docInfos={docInfos}/>
                                    </PremiumFeature>
                                </div>

                            </div>

                            <div className="row mt-2 tag-statistics">

                                <div className="col-lg-8">
                                    <PremiumFeature required='bronze' feature="statistics" size="lg">
                                        <TopTagsChart docInfos={docInfos}/>
                                    </PremiumFeature>
                                </div>

                                <div className="col-lg-4">
                                    <PremiumFeature required='bronze' feature="statistics" size="lg">
                                        <TopTagsTable docInfos={docInfos}/>
                                    </PremiumFeature>
                                </div>

                            </div>

                        </div>

                    </FixedNavBody>

                </FixedNav>

            );
        }

    }

}

export interface IProps {
    readonly persistenceLayerManager: PersistenceLayerManager;
    readonly repoDocMetaManager: RepoDocMetaManager;
}

export interface IState {
    readonly isReviewer?: boolean;
}
