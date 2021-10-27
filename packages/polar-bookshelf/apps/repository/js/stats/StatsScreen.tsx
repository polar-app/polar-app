import * as React from 'react';
import {FixedNav} from '../FixedNav';
import {SpacedRepQueueChart} from "./SpacedRepQueueChart";
import {ReviewerTasks} from "../reviewer/ReviewerTasks";
import {Logger} from "polar-shared/src/logger/Logger";
import {PremiumFeature} from "../../../../web/js/ui/premium_feature/PremiumFeature";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {useRepoDocMetaManager} from "../persistence_layer/PersistenceLayerApp";
import {useComponentDidMount} from "../../../../web/js/hooks/ReactLifecycleHooks";
import {ReadingProgressTable} from "./ReadingProgressTable";
import {Helmet} from "react-helmet";
import {DockLayout} from "../../../../web/js/ui/doc_layout/DockLayout";

const log = Logger.create();

export interface ReadingStatsProps {
    readonly docInfos?: ReadonlyArray<IDocInfo>;
}

const ReadingStats = (props: ReadingStatsProps) => {
    return (
        <div>

            <SectionHeader>
                <h1>Statistics</h1>

                <SectionText>
                    Polar keeps track of statistics of your document repository so you can better understand
                    your reading habits and what types of documents are stored in your repository.
                </SectionText>
            </SectionHeader>

            <PremiumFeature required='plus' feature="statistics" size="lg">
                <ReadingProgressTable docInfos={props.docInfos}/>
            </PremiumFeature>
        </div>
    );
}

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

            <div className="mt-2">
                <div className="">
                    <SpacedRepQueueChart mode='flashcard' type='queue'/>
                </div>
            </div>

            <div className="mt-2">
                <div className="">
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

            <div className="mt-2">
                <div className="">
                    <SpacedRepQueueChart mode='reading' type='queue'/>
                </div>
            </div>

            <div className="mt-2">
                <div className="">
                    <SpacedRepQueueChart mode='reading' type='completed'/>
                </div>
            </div>

        </div>;

    }

    return <div/>;

};

const SectionHeader = (props: any) => {
    return <div className="mt-3">
        {props.children}
    </div>;
};

const SectionText = (props: any) => {
    return <p className="text-lg">
        {props.children}
    </p>;
};

function useDocInfos(): ReadonlyArray<IDocInfo> {

    const repoDocMetaManager = useRepoDocMetaManager();

    return repoDocMetaManager.repoDocInfoIndex.values()
                             .map(current => current.docInfo);

}

interface ReviewerProps {
    readonly isReviewer: boolean;
}

const Desktop = (props: ReviewerProps) => {

    const docInfos = useDocInfos();

    return (
        <div style={{
                 display: 'flex',
                 flexDirection: 'column',
                 flexGrow: 1,
                 minWidth: 0,
                 minHeight: 0,
                 paddingBottom: 20,
                 overflowY: 'auto',
             }}>

            <div style={{
                     maxWidth: '1200px',
                     width: '100%',
                     marginLeft: 'auto',
                     marginRight: 'auto',
                     flexGrow: 1,
                     padding: '10px'
                 }}>

                <ReadingStats docInfos={docInfos}/>

                <ReviewerStats isReviewer={props.isReviewer}/>

                {/* <PremiumFeature required='plus'
                                feature="statistics"
                                size="lg">
                    <TopTagsChart docInfos={docInfos}/>
                </PremiumFeature> */}

            </div>

        </div>
    );

};

const PhoneAndTablet = React.memo(function PhoneAndTablet(props: ReviewerProps) {

    return (
        <FixedNav id="doc-repository"
                  className="statistics-view">

            <FixedNav.Body className="">

                <DockLayout.Root dockPanels={[
                    {
                        id: 'dock-panel-center',
                        type: 'grow',
                        component: (
                            <div className="ml-1 mr-1">
                                <ReviewerStats isReviewer={props.isReviewer}/>
                            </div>
                        )
                    },
                ]}>
                    <DockLayout.Main />
                </DockLayout.Root>

            </FixedNav.Body>

        </FixedNav>
    );

});


export interface IState {
    readonly isReviewer: boolean;
}

export const StatsScreen = React.memo(function StatsScreen() {

    const [state, setState] = React.useState<IState>({isReviewer: false});

    useComponentDidMount(() => {

        // TODO: we shouldn't use this I think as it's not supported well on modern react...

        // TODO: migrate this to the new DataProvider system as there is a race here
        // and this code isn't very pretty

        const doAsync = async () => {
            const isReviewer = await ReviewerTasks.isReviewer();
            setState({isReviewer});
        }

        doAsync()
            .catch(err => log.error(err));

    })

    return (

        <>
            <Helmet>
                <title>Polar: Statistics</title>
            </Helmet>
            <Desktop {...state}/>
        </>
    );

});
