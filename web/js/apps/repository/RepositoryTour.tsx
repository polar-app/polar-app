import Joyride, {CallBackProps, Step, STATUS, EVENTS, ACTIONS, placement} from 'react-joyride';
import * as React from 'react';
import {LifecycleToggle} from '../../ui/util/LifecycleToggle';
import {LifecycleEvents} from '../../ui/util/LifecycleEvents';
import {RendererAnalytics} from '../../ga/RendererAnalytics';
import {Feedback} from '../../ui/feedback/Feedback';
import {SplitBar, SplitBarLeft, SplitBarRight} from '../../../../apps/repository/js/SplitBar';
import {SplitLayout, SplitLayoutLeft, SplitLayoutRight} from '../../ui/split_layout/SplitLayout';
import {Button} from 'reactstrap';
import {Logger} from '../../logger/Logger';
import {AppActivities, AppActivity} from '../../util/AppActivities';

const log = Logger.create();

export class Styles {

    public static IMG: React.CSSProperties = {
        maxWidth: '450px',
        maxHeight: '325px',
        marginBottom: '10px',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
    };

    public static SPLIT_BAR_IMG: React.CSSProperties = {
        maxWidth: '225px',
        maxHeight: '225px',
        marginBottom: '10px',
        display: 'block',
        marginLeft: '5px',
        marginRight: '5px',
    };

}

interface ImageStep {
    readonly title?: React.ReactNode;
    readonly content: React.ReactNode;
    readonly image: string | React.ReactNode;
    readonly target: string;
    readonly placement?: placement;
    readonly autoNext?: boolean;
}

export class RepositoryTour extends React.Component<IProps, IState> {

    private callback?: CallBackProps;

    private steps: EnhancedStep[];

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onCallback = this.onCallback.bind(this);
        this.onAppActivity = this.onAppActivity.bind(this);
        this.createSteps = this.createSteps.bind(this);

        this.steps = this.createSteps();

        // true if the tour should be running.
        const run = ! LifecycleToggle.isMarked(LifecycleEvents.TOUR_TERMINATED);

        this.state = {
            run,
            stepIndex: 0
        };

        if (this.state.run) {
            AppActivities.get().addEventListener(appActivity => this.onAppActivity(appActivity));
        }

    }

    private createImageStep(step: ImageStep): EnhancedStep {

        const Image = () => {

            if (typeof step.image === 'string') {
                return <img src={step.image} style={Styles.SPLIT_BAR_IMG}/>;
            } else {
                return <div>{step.image}</div>;
            }
        };

        return {
            target: step.target,
            title: step.title,
            disableBeacon: true,
            styles: {
                tooltip: {
                    width: '700px'
                }
            },
            content: <div>

                <SplitLayout>

                    <SplitLayoutLeft>

                        {step.content}

                    </SplitLayoutLeft>

                    <SplitLayoutRight>

                        <Image/>

                    </SplitLayoutRight>

                </SplitLayout>

            </div>,
            placement: step.placement,
            autoNext: step.autoNext
        };

    }

    public render() {

        return (

            <Joyride
                steps={this.steps}
                continuous={true}
                callback={data => this.onCallback(data)}
                run={this.state.run}
                showProgress={true}
                showSkipButton={true}
                stepIndex={this.state.stepIndex}
                styles={{
                    options: {
                        // arrowColor: '#e3ffeb',
                        // backgroundColor: '#e3ffeb',
                        // overlayColor: 'rgba(79, 26, 0, 0.4)',
                        primaryColor: '#007bff',
                        // textColor: '#004a14',
                        // width: 900,
                        // zIndex: 1000,
                    },
                    tooltipContainer: {
                        textAlign: 'left',
                    }
                }}
            />

        );

    }

    private createSteps(): EnhancedStep[] {

        // FIXME: if the user clicks out of the tour then the tour stops
        // and the beacon is displayed.
        //
        // FIXME: show them how to use the rich text area including images,
        // HTML, etc.

        const Term = (props: any) => {
            return <b><i>{props.children}</i></b>;
        };

        const Title = (props: any) => {
            return <div style={{
                fontSize: '22px',
                marginLeft: '10px'}}>
                {props.children}
            </div>;
        };

        interface IconProps {
            className: string;
        }

        const Icon = (props: IconProps) => {
            return <div className="text-primary">
                <i className={props.className}
                   style={{
                       fontSize: '175px',
                       marginLeft: '5px',
                   }}>

                </i>
            </div>;
        };

        const steps: EnhancedStep[] = [
            // // TODO: I'd like to make this an image step but it doesn't layout the image propery.
            // // {
            // //     target: 'header',
            // //     content: <div>
            // //         <h2 className="text-center">Welcome to Polar!</h2>
            // //
            // //         <p>
            // //             We're going to give you a quick tour of how to use the
            // //             main features in Polar.
            // //         </p>
            // //
            // //         <p>
            // //             Polar allows you to:
            // //         </p>
            // //
            // //         <ul>
            // //
            // //             <li>Keep all your documents in one place.</li>
            // //
            // //             <li>Easily keep track of your reading with <b>pagemarks</b> and <b>stats tracking</b>.</li>
            // //
            // //             <li><b>Annotate</b>, <b>tag</b>, and <span className="text-dark" style={{backgroundColor: 'yellow'}}><b>highlight</b></span> all your documents and build a personal knowledge repository.</li>
            // //
            // //         </ul>
            // //
            // //         <p>
            // //             The tour should take about 60 seconds.
            // //         </p>
            // //
            // //     </div>,
            // //     styles: {
            // //         tooltip: {
            // //             width: '650px'
            // //         }
            // //     },
            // //     disableBeacon: true,
            // //     placement: 'center'
            // // },
            //
            // this.createImageStep({
            //     target: 'header',
            //     // title: <Title>Document Repository</Title>,
            //     content: <div>
            //         <h2 className="text-center">Welcome to Polar!</h2>
            //
            //         <p>
            //             We're going to give you a quick tour of how to use the
            //             main features in Polar.
            //         </p>
            //
            //         <p>
            //             Polar allows you to:
            //         </p>
            //
            //         <ul>
            //
            //             <li>Keep all your documents in one place.</li>
            //
            //             <li>Easily keep track of your reading with <b>pagemarks</b> and <b>stats tracking</b>.</li>
            //
            //             <li><b>Annotate</b>, <b>tag</b>, and <span className="text-dark" style={{backgroundColor: 'yellow'}}><b>highlight</b></span> all your documents and build a personal knowledge repository.</li>
            //
            //         </ul>
            //
            //         <p>
            //             The tour should take about 60 seconds.
            //         </p>
            //
            //     </div>,
            //     image: "/icon.png",
            //     placement: 'center'
            //
            // }),
            //
            // // this.createImageStep({
            // //     target: '#doc-repo-table .rt-tbody > div:nth-child(-n+1)',
            // //     title: <Title>Document Repository</Title>,
            // //     content: <div>
            // //         <p>
            // //             Your documents are kept here in
            // //             the <Term>document repository</Term> and
            // //             can be opened with by <Term>double clicking</Term>.
            // //         </p>
            // //
            // //         <p>
            // //             We went ahead and added some <b>sample documents</b> so you can
            // //             see what Polar looks like in action.  You can just
            // //             delete them once the tour is finished.
            // //         </p>
            // //     </div>,
            // //  // image: "/web/assets/images/icon.svg",
            // //     image: "/web/assets/images/files.svg"
            // // }),
            //
            // this.createImageStep({
            //     target: '#doc-repo-table .rt-tbody > div:nth-child(-n+1)',
            //     title: <Title>Document Repository</Title>,
            //     content: <div>
            //         <p>
            //             Your documents are kept here in
            //             the <Term>document repository</Term> and
            //             can be opened with by <Term>double clicking</Term>.
            //         </p>
            //
            //         <p>
            //             We went ahead and added some <b>sample documents</b> so you can
            //             see what Polar looks like in action.  You can just
            //             delete them once the tour is finished.
            //         </p>
            //     </div>,
            //     image: "/web/assets/images/files.svg"
            // }),
            //
            // this.createImageStep({
            //     target: '#add-content-dropdown',
            //     title: <Title>Add Documents</Title>,
            //     content: <div>
            //         <p>
            //             Documents can easily be added by clicking the <Term>Add</Term> button
            //             and we can import documents individually or in bulk from
            //             a local directory.
            //         </p>
            //         <p>
            //             Once the tour is over you'll probably want to use this
            //             feature to add any documents you're currently reading.
            //         </p>
            //     </div>,
            //     image: "/web/assets/images/add-file.svg"
            // }),
            // this.createImageStep({
            //     target: '#enable-cloud-sync, #cloud-sync-dropdown',
            //     title: <Title>Cloud Sync</Title>,
            //     content: <div>
            //         <p>
            //             Polar supports <Term>cloud sync</Term> which keeps all your
            //             documents securely backed up in the cloud.
            //             Enabling <Term>cloud sync</Term> also allow you to keep all your
            //             computers that run Polar fully synchronized.
            //         </p>
            //
            //         <p>
            //             This works transparently and realtime across MacOS,
            //             Windows, and Linux.
            //         </p>
            //     </div>,
            //     image:
            //         <Icon className="fas fa-cloud-upload-alt"/>
            //
            // }),
            //
            // this.createImageStep({
            //     target: '#discord-button',
            //     title: <Title>Discord Chat</Title>,
            //     content: <div>
            //         <p>
            //             We have a directly link to <Term>Discord chat</Term> to
            //             enable you to discuss Polar live with the developers
            //             and other users.
            //         </p>
            //
            //         <p>
            //             Feel free to jump in at any time and give us feedback
            //             at any time.
            //         </p>
            //     </div>,
            //     image:
            //         <Icon className="fab fa-discord"/>
            //
            // }),
            //
            // {
            //     target: '.doc-table-col-progress',
            //     title: <Title>Reading Progress</Title>,
            //     disableBeacon: true,
            //     content: <div>
            //         Each document has a progress associated with it which is
            //         derived from pagemarks. Pagemarks are similar to bookmarks
            //         but manually updated on each document while you read.
            //     </div>,
            //
            //     // placement: "bottom",
            // },
            //
            // this.createImageStep({
            //     target: '.doc-table-col-tags',
            //     title: <Title>Tags</Title>,
            //     content: <div>
            //         <p>
            //             Each document can be tagged to enable
            //             filtering and allow you to easily manage your documents.
            //         </p>
            //
            //         <p>Tags for documents are also assigned to your annotations.</p>
            //
            //     </div>,
            //     image:
            //         <Icon className="fa fa-tag"/>
            //
            // }),
            //
            // {
            //     target: '.doc-table-col-added',
            //     title: <Title>Sorting</Title>,
            //     disableBeacon: true,
            //     content: <div>
            //         We keep track of the time a document
            //         was <Term>added</Term> and <Term>updated</Term> so
            //         you can sort by time to read the most recently added (or
            //         updated) documents first.
            //     </div>,
            //     // placement: "bottom",
            // },
            //
            // {
            //     target: '.doc-table-col-title',
            //     disableBeacon: true,
            //     content: <div>
            //         The title of the document is automatically set when it's
            //         added but you can change it at any time
            //     </div>,
            //     // placement: "bottom",
            // },
            //
            // {
            //     target: '.doc-table-col-mutate-tags',
            //     disableBeacon: true,
            //     content: <div>
            //         The <Term>tag</Term> button allow you to assign new <b><i>tags</i></b> a document
            //     </div>,
            //     // placement: "bottom",
            // },
            //
            // {
            //     target: '.doc-table-col-mutate-flags',
            //     disableBeacon: true,
            //     content: <div>
            //         The <Term>flag</Term> button allow you to mark important
            //         documents.  Once flagged you can use the <Term>filter bar</Term> to
            //         show only flagged documents.
            //     </div>,
            //     // placement: "bottom",
            // },
            //
            // {
            //     target: '.doc-table-col-mutate-archived',
            //     disableBeacon: true,
            //     content: <div>This <Term>archive</Term> allow you to hide a document once read.</div>,
            //     // placement: "bottom",
            // },
            //
            // {
            //     target: '.doc-dropdown',
            //     disableBeacon: true,
            //     content:  <div>
            //         The dropdown allow you perform other actions on a document
            //         including changing the title and deleting documents.
            //     </div>,
            //     // placement: "bottom",
            // },
            //
            // {
            //     title: <Title>Filter Bar</Title>,
            //     target: '#toggle-flagged',
            //     disableBeacon: true,
            //     content: <div>The <Term>filter bar</Term> allows you to
            //         configure which documents are visible.
            //         This button allows you to hide/show <Term>flagged</Term> documents.
            //     </div>,
            // },
            //
            // {
            //     target: '#toggle-archived',
            //     disableBeacon: true,
            //     content: <div>
            //         Toggle <Term>archived</Term> documents (hidden by default).  It's usually
            //         best to archive a document after it's been read.
            //     </div>,
            // },
            //
            // {
            //     target: '#filter-tag-input',
            //     disableBeacon: true,
            //     content: <div>
            //         The tag filter allows you to narrow down the
            //         list of documents by tag.</div>,
            // },
            // {
            //     target: '#filter_title',
            //     content: 'Search the list of documents by title.',
            //     disableBeacon: true,
            // },
            // //
            // // {
            // //     // target: '#doc-repo-table .rt-tbody > div:nth-child(-n+4)',
            // //     target: '#doc-repo-table .rt-tbody > div:nth-child(-n+1)',
            // //     title: <Title>Open a document</Title>,
            // //     disableBeacon: true,
            // //     spotlightClicks: true,
            // //     content: <div>
            // //
            // //         <i className="fas fa-book-open text-primary"
            // //            style={{fontSize: '150px'}}></i>
            // //
            // //         <p>
            // //             Let's open a document.
            // //         </p>
            // //
            // //         <p>
            // //             Go ahead and <Term>double click</Term> on the
            // //             highlighted document row and a new window will open.
            // //         </p>
            // //
            // //     </div>,
            // //     // placement: "bottom",
            // // },





            {
                id: 'expand-sidebar-for-stats',
                target: '#toggle-sidebar',
                content: <div>

                    <Term>Click</Term> this button to display the sidebar.

                </div>,
                spotlightClicks: true,
                disableBeacon: true,
                placement: 'right',
                hideFooter: true,
                hideCloseButton: true,
                autoNext: true,
            },
            {
                id: 'select-sidebar',
                title: <Title>Sidebar</Title>,
                target: '.repo-sidebar section[data-expanded=true]',
                content: <div>
                    The <Term>sidebar</Term> allows you to select different
                    views including
                    the <Term>annotation</Term> and <Term>statistics</Term> views.
                </div>,
                disableBeacon: true,
                placement: 'right',
                spotlightPadding: 0
            },

            {
                title: <Title>Sidebar</Title>,
                target: '#sidebar-item-stats',
                content: <div>
                    Now <Term>click here</Term> to view the <Term>statistics view</Term>.

                </div>,
                spotlightClicks: true,
                disableBeacon: true,
                placement: 'right',
                hideFooter: true,
                spotlightPadding: 0,
                styles: {
                    options: {
                        zIndex: 1000
                    }
                },
                autoNext: true
            },

            this.createImageStep({
                target: '.statistics-view header',
                title: <Title>Statistics View</Title>,
                content: <div>
                    <p>
                        This is the <Term>statistics view</Term>.  It allows you to view importants
                        statistics regarding your reading and your document repository.
                    </p>
                </div>,
                image: "/web/assets/images/statistics.svg",
                placement: 'center'
            }),

            {
                title: <Title>Reading Progress</Title>,
                target: '#reading-progress-table',
                content: <div>
                    <p>
                        The <Term>reading progress</Term> metric allows you to track
                        how often you're reading to encourage you to hit your goals.
                    </p>

                    <p>
                        Each column is a week and we display 52 weeks to represent
                        the entire year.
                    </p>

                </div>,
                disableBeacon: true,
            },

            // TODO: the tags and documents added per day.

            {
                target: 'header',
                // title: <Title>Thanks for taking the tour!</Title>,
                content: <div>

                    <div className="text-center">
                        <Feedback category="tour-feedback"
                                  title="How likely are you to continue using Polar?"
                                  description="We wanted to get your initial thoughts after taking the tour."
                                  from="Not likely"
                                  to="Very likely"
                                  unsure={true}/>
                    </div>

                </div>,
                styles: {
                    tooltip: {
                        width: '650px'
                    }
                },
                disableBeacon: true,
                placement: 'center'
            }


        ];

        return steps;

    }

    private onAppActivity(appActivity: AppActivity<any>) {

        console.log("FIXME: onAppActivity: " , appActivity);

        this.doStep(this.callback!);

        // FIXME: if the current step is


    }

    private onCallback(callbackProps: CallBackProps): void {

        console.log("FIXME: onCallback: " , callbackProps);

        this.callback = callbackProps;

        RendererAnalytics.event({category: 'tour', action: 'did-step-' + callbackProps.index});

        // FIXME: action: close, skip isn't handled
        // FIXME: what does close do in an un-controlled tour .. is it skip or finish?

        const step: EnhancedStep = callbackProps.step;

        if (callbackProps.action === 'update' && step.autoNext) {

            const nextStep = this.steps[callbackProps.index + 1];

            console.log("FIXME: going to do autoNext with step: " , nextStep);

            const nextHandler = (): boolean => {

                if (nextStep.target instanceof HTMLElement) {
                    return true;
                }

                const selector = nextStep.target;

                return document.querySelector(selector) != null;

            };

            let mutationObserver: MutationObserver;

            const mutationHandler = () => {

                if (nextHandler()) {
                    mutationObserver.disconnect();

                    console.log("FIXME: ADVANCING and incrementing manually");
                    // this.doStep(callbackProps);

                    const stepIndex = this.state.stepIndex + 1;

                    console.log("FIXME: going to step indeX: " + stepIndex);

                    this.setState({
                        ...this.state,
                        stepIndex,
                        run: false
                    });

                }

            };

            mutationObserver = new MutationObserver(mutationHandler);

            mutationObserver.observe(document.body, {
                childList: true,
                attributes: true,
                subtree: true
            });

            // call it once manually after the event was registered as the
            // element might already be visible in the DOM at which point we're
            // already done.
            mutationHandler();

        }

        if (callbackProps.status === STATUS.SKIPPED || callbackProps.status === STATUS.FINISHED) {

            try {

                // FIXME?
                // this.setState({ run: false, stepIndex: 0 });

                switch (callbackProps.status) {
                    case STATUS.SKIPPED:
                        RendererAnalytics.event({category: 'tour-result', action: 'skipped'});
                        RendererAnalytics.event({category: 'tour-skip', action: 'skipped-at-step-' + callbackProps.index});

                        LifecycleToggle.mark(LifecycleEvents.TOUR_SKIPPED);
                        break;
                    case STATUS.FINISHED:
                        RendererAnalytics.event({category: 'tour-result', action: 'finished'});

                        LifecycleToggle.mark(LifecycleEvents.TOUR_FINISHED);
                        break;
                }

            } finally {
                LifecycleToggle.mark(LifecycleEvents.TOUR_TERMINATED);
            }

        } else if (callbackProps.type === EVENTS.STEP_AFTER) {

            if ( ! this.state.run) {

                setTimeout(() => {

                    this.setState({
                        ...this.state,
                        run: true
                    });

                }, 250);

                return;

            }

            // FIXME: we ahve to look at the index here as with auto-advance we
            // might already be on it...

            console.log("=====");
            console.log("FIXME: ADVANCING via AFTER");

            this.doStep(callbackProps);

        } else if (callbackProps.type === EVENTS.TARGET_NOT_FOUND) {

            // FIXME: add a DOM event listener to wait for it to become
            // available...

            console.log("FIXME: ADVANCING via TARGET_NOT_FOUND");

            log.warn("Not found: ", callbackProps);

            this.doStep(callbackProps);
        }

    }

    private doStep(callBackProps: CallBackProps) {

        const stepIndex = this.state.stepIndex + (callBackProps.action === ACTIONS.PREV ? -1 : 1);

        console.log("FIXME: going to stepIndex: " + stepIndex);

        this.setState({...this.state, stepIndex });

    }


}

export interface IProps {

}

export interface IState {
    readonly run: boolean;
    readonly stepIndex: number;
}

/**
 * An enhanced step with a few more fields.
 */
interface EnhancedStep extends Step {

    readonly id?: string;

    /**
     * True when we should go the next step as soon as its selector is available.
     */
    readonly autoNext?: boolean;

}
