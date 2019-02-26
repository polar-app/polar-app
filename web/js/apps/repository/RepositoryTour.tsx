import Joyride, {ACTIONS, CallBackProps, EVENTS, placement, STATUS} from 'react-joyride';
import * as React from 'react';
import {LifecycleToggle} from '../../ui/util/LifecycleToggle';
import {LifecycleEvents} from '../../ui/util/LifecycleEvents';
import {RendererAnalytics} from '../../ga/RendererAnalytics';
import {Feedback} from '../../ui/feedback/Feedback';
import {SplitLayout, SplitLayoutLeft, SplitLayoutRight} from '../../ui/split_layout/SplitLayout';
import {Logger} from '../../logger/Logger';
import {LoadExampleDocs} from './onboarding/LoadExampleDocs';
import {EnhancedStep, JoyrideTours} from '../../ui/tours/JoyrideTours';

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


export class RepositoryTour extends React.Component<IProps, IState> {

    private callback?: CallBackProps;

    private steps: EnhancedStep[];

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onCallback = this.onCallback.bind(this);
        this.createSteps = this.createSteps.bind(this);

        this.steps = this.createSteps();

        // true if the tour should be running.
        const run = ! LifecycleToggle.isMarked(LifecycleEvents.TOUR_TERMINATED);

        this.state = {
            run,
            stepIndex: 0
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
                }}></Joyride>

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
            JoyrideTours.createImageStep({
                target: 'header',
                // title: <Title>Document Repository</Title>,
                content: <div>
                    <h2 className="text-center">Welcome to Polar!</h2>

                    <p>
                        We're going to give you a quick tour of how to use the
                        main features in Polar.
                    </p>

                    <p>
                        Polar allows you to:
                    </p>

                    <ul>

                        <li>Keep all your documents in one place.</li>

                        <li>Easily keep track of your reading with <b>pagemarks</b> and <b>stats tracking</b>.</li>

                        <li><b>Annotate</b>, <b>tag</b>, and <span className="text-dark" style={{backgroundColor: 'yellow'}}><b>highlight</b></span> all your documents and build a personal knowledge repository.</li>

                    </ul>

                    <p>
                        The tour should take about 60 seconds.
                    </p>

                </div>,
                image: "/icon.png",
                placement: 'center'

            }),

            JoyrideTours.createImageStep({
                target: '#doc-repo-table .rt-tbody > div:nth-child(-n+1)',
                title: <Title>Document Repository</Title>,
                content: <div>
                    <p>
                        Your documents are kept here in
                        the <Term>document repository</Term> and
                        can be opened by <Term>double clicking</Term>.
                    </p>

                    <p>
                        We went ahead and added some <b>sample documents</b> so you can
                        see what Polar looks like in action.  You can just
                        delete them once the tour is finished.
                    </p>
                </div>,
                image: "/web/assets/images/files.svg"
            }),

            JoyrideTours.createImageStep({
                target: '#add-content-dropdown',
                title: <Title>Add Documents</Title>,
                content: <div>
                    <p>
                        Documents can easily be added by clicking the <Term>Add</Term> button
                        and you can import documents individually or in bulk from
                        a local directory.
                    </p>
                    <p>
                        Once the tour is over you'll probably want to use this
                        feature to add any documents you're currently reading.
                    </p>
                </div>,
                image: "/web/assets/images/add-file.svg"
            }),

            JoyrideTours.createImageStep({
                target: '#enable-cloud-sync, #cloud-sync-dropdown',
                title: <Title>Cloud Sync</Title>,
                content: <div>
                    <p>
                        Polar supports <Term>cloud sync</Term> which keeps all your
                        documents securely backed up in the cloud.
                        Enabling <Term>cloud sync</Term> also allow you to keep all your
                        computers that run Polar fully synchronized.
                    </p>

                    <p>
                        This works transparently and realtime across MacOS,
                        Windows, and Linux.
                    </p>
                </div>,
                image:
                    <Icon className="fas fa-cloud-upload-alt"/>

            }),

            JoyrideTours.createImageStep({
                target: '#discord-button',
                title: <Title>Discord Chat</Title>,
                content: <div>
                    <p>
                        We have a directly link to <Term>Discord chat</Term> to
                        enable you to discuss Polar live with the developers
                        and other users.
                    </p>

                    <p>
                        Feel free to jump in at any time and give us feedback
                        at any time.
                    </p>
                </div>,
                image:
                    <Icon className="fab fa-discord"/>

            }),

            {
                target: '.doc-table-col-progress',
                title: <Title>Reading Progress</Title>,
                disableBeacon: true,
                content: <div>
                    Each document has a progress associated with it which is
                    derived from pagemarks. Pagemarks are similar to bookmarks
                    but manually updated on each document while you read.
                </div>,

                // placement: "bottom",
            },

            JoyrideTours.createImageStep({
                target: '.doc-table-col-tags',
                title: <Title>Tags</Title>,
                content: <div>
                    <p>
                        Each document can be tagged to enable
                        filtering and allow you to easily manage your documents.
                    </p>

                    <p>Tags for documents are also assigned to your annotations.</p>

                </div>,
                image:
                    <Icon className="fa fa-tag"/>

            }),


            {
                target: '.doc-dropdown',
                disableBeacon: true,
                content: <div>

                    <p>
                        Documents can
                        be <Term>tagged</Term>, <Term>flagged</Term>, <Term>archived</Term> and <Term>deleted</Term> by using
                        these buttons to the right.
                    </p>

                    <p>
                         The <Term>tag</Term> button allow you to assign new <b><i>tags</i></b> a document
                    </p>

                    <p>
                         The <Term>flag</Term> button allow you to mark important
                         documents.  Once flagged you can use the <Term>filter bar</Term> to
                         show only flagged documents.
                    </p>

                    <p>
                        The <Term>archive</Term> button allow you to
                        hide a document once read.  It's usually best to
                        archive a document once it's been read.
                    </p>

                </div>,
                styles: {
                    tooltip: {
                        width: '650px'
                    }
                },
                // placement: "bottom",
            },

            {
                target: '#filter-bar',
                disableBeacon: true,
                content: <div>

                    <p>
                        The <Term>filter bar</Term> allows you to configure
                        which documents are visible.
                    </p>

                    <p>
                        You can hide/show documents that are flagged, archived and
                        also filter by tags or search by title.
                    </p>

                </div>,
                styles: {
                    tooltip: {
                        width: '650px'
                    }
                },
            },


            {
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
            // TODO: needs to be positioned about a 3rd of the way down the
            // page...
            {
                title: <Title>Sidebar</Title>,
                target: '.repo-sidebar section[data-expanded=true]',
                content: <div>
                    The <Term>sidebar</Term> allows you to select different
                    views including
                    the <Term>annotation</Term> and <Term>statistics</Term> views.
                </div>,
                disableBeacon: true,
                placement: 'right-start',
                offset: 10,
                spotlightPadding: 0,
                hideBackButton: true
            },
            {
                title: <Title>Annotations</Title>,
                target: 'section[data-expanded=true] #sidebar-item-annotations',
                content: <div>
                    Now <Term>click here</Term> to view the <Term>annotations view</Term>.

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

            JoyrideTours.createImageStep({
                target: '.annotations-view header',
                title: <Title>Annotations View</Title>,
                content: <div>
                    <p>
                        This is the <Term>annotations view</Term>.  It allows you
                        to view all your annotations including highlights,
                        comments, and flashcards.
                    </p>
                </div>,
                image: "/web/assets/images/doc.svg",
                placement: 'center'
            }),

            {
                target: '#toggle-sidebar',
                content: <div>

                    <p>
                        Now let's go to the <Term>statistics view.</Term>
                    </p>

                    <p>
                        <Term>Click</Term> this button to display the sidebar.
                    </p>

                </div>,
                spotlightClicks: true,
                disableBeacon: true,
                placement: 'right',
                hideFooter: true,
                hideCloseButton: true,
                autoNext: true,
            },


            {
                title: <Title>Sidebar</Title>,
                target: 'section[data-expanded=true] #sidebar-item-stats',
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

            JoyrideTours.createImageStep({
                target: '.statistics-view header',
                title: <Title>Statistics View</Title>,
                content: <div>
                    <p>
                        This is the <Term>statistics view</Term>.  It allows you
                        to view importants statistics regarding your reading,
                        documents, and annotations including the rate of new
                        documents and statistics on your tags.
                    </p>
                </div>,
                image: "/web/assets/images/statistics.svg",
                hideBackButton: true,
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
                        Each column is one week and we display 52 weeks to
                        represent the entire year.
                    </p>

                </div>,
                disableBeacon: true,
            },

            {
                target: '#toggle-sidebar',
                content: <div>

                    <p>
                        Now let's go back to the <Term>documents view.</Term>
                    </p>

                    <p>
                        <Term>Click</Term> this button to display the sidebar.
                    </p>

                </div>,
                spotlightClicks: true,
                disableBeacon: true,
                placement: 'right',
                hideFooter: true,
                hideCloseButton: true,
                autoNext: true,
            },


            {
                title: <Title>Select documents view...</Title>,
                target: 'section[data-expanded=true] #sidebar-item-documents',
                content: <div>
                    Now <Term>click</Term> to view the <Term>documents view</Term>.

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

            JoyrideTours.createImageStep({
                target: `#doc-table div[data-doc-fingerprint='${LoadExampleDocs.MAIN_ANNOTATIONS_EXAMPLE_FINGERPRINT}']`,
                title: <Title>Open a document</Title>,
                content: <div>

                    <p>
                        Let's open a document.
                    </p>

                    <p>
                        Go ahead and <Term>double click</Term> on the
                        highlighted document row and a new window will open.
                    </p>

                    <p>
                        This specific document has some example annotations.
                    </p>

                </div>,
                spotlightClicks: true,
                image:
                    <Icon className="fas fa-book-open"/>

            }),

            // TODO: auto advance to this once the document has been opened and
            // we 've done the viewer tour and I think this should be more of a
            // checklist.

            {
                target: 'header',
                content: <div>

                    <h2 className="text-center">Thanks for taking the tour!</h2>

                    <p>
                        Now that you understand Polar your next steps are to
                        add documents.
                    </p>

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
            //     target: '.doc-dropdown',
            //     disableBeacon: true,
            //     content:  <div>
            //         The dropdown allow you perform other actions on a
            // document including changing the title and deleting documents.
            // </div>, // placement: "bottom", },   // // { //     // target:
            // '#doc-repo-table .rt-tbody > div:nth-child(-n+4)', //
            // target: '#doc-repo-table .rt-tbody > div:nth-child(-n+1)', //
            //  title: <Title>Open a document</Title>, //     disableBeacon:
            // true, //     spotlightClicks: true, //     content: <div> // //
            //        <i className="fas fa-book-open text-primary" //
            //  style={{fontSize: '150px'}}></i> // //         <p> //
            //   Let's open a document. //         </p> // //         <p> //
            //          Go ahead and <Term>double click</Term> on the //             highlighted document row and a new window will open. //         </p> // //     </div>, //     // placement: "bottom", // },

        ];

        return steps;

    }

    private onCallback(callbackProps: CallBackProps): void {

        this.callback = callbackProps;

        RendererAnalytics.event({category: 'tour', action: 'did-step-' + callbackProps.index});

        // FIXME: action: close, skip isn't handled
        // FIXME: what does close do in an un-controlled tour .. is it skip or
        // finish?

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

                    const stepIndex = this.state.stepIndex + 1;

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

            this.doStep(callbackProps);

        } else if (callbackProps.type === EVENTS.TARGET_NOT_FOUND) {

            // FIXME: add a DOM event listener to wait for it to become
            // available...

            log.warn("Not found: ", callbackProps);

            this.doStep(callbackProps);
        }

    }

    private doStep(callBackProps: CallBackProps) {

        const stepIndex = callBackProps.index + (callBackProps.action === ACTIONS.PREV ? -1 : 1);

        this.setState({...this.state, stepIndex });

    }


}

export interface IProps {

}

export interface IState {
    readonly run: boolean;
    readonly stepIndex: number;
}
