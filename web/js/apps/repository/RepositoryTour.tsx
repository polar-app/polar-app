import Joyride, {CallBackProps, Step, STATUS, EVENTS, ACTIONS} from 'react-joyride';
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
    readonly title: React.ReactNode;
    readonly content: React.ReactNode;
    readonly image: string | React.ReactNode;
    readonly target: string;
}

export class RepositoryTour extends React.Component<IProps, IState> {

    private callback?: CallBackProps;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onCallback = this.onCallback.bind(this);
        this.onAppActivity = this.onAppActivity.bind(this);

        this.state = {
            run: ! LifecycleToggle.isMarked(LifecycleEvents.TOUR_TERMINATED),
            stepIndex: 0
        };

        if (this.state.run) {
            AppActivities.get().addEventListener(appActivity => this.onAppActivity(appActivity));
        }

    }

    private createImageStep(step: ImageStep): Step {

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
        };

    }

    public render() {

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
            {
                target: 'header',
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
                styles: {
                    tooltip: {
                        width: '650px'
                    }
                },
                disableBeacon: true,
                placement: 'center'
            },

            this.createImageStep({
                target: '#doc-repo-table .rt-tbody > div:nth-child(-n+1)',
                title: <Title>Document Repository</Title>,
                content: <div>
                    <p>
                        Your documents are kept here in
                        the <Term>document repository</Term> and
                        can be opened with by <Term>double clicking</Term>.
                    </p>

                    <p>
                        We went ahead and added some sample documents so you can
                        see what Polar looks like in action.  You can just
                        delete them once the tour is finished.
                    </p>
                </div>,
                image: "/web/assets/images/files.svg"
            }),

            this.createImageStep({
                target: '#add-content-dropdown',
                title: <Title>Add Documents</Title>,
                content: <div>
                    <p>
                        Documents can easily be added by clicking the <Term>Add</Term> button
                        and we can import documents individually or in bulk from
                        a local directory.
                    </p>
                    <p>
                        Once the tour is over you'll probably want to use this
                        feature to add any documents you're currently reading.
                    </p>
                </div>,
                image: "/web/assets/images/add-file.svg"
            }),
            this.createImageStep({
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

            this.createImageStep({
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

            this.createImageStep({
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
                target: '.doc-table-col-added',
                title: <Title>Sorting</Title>,
                disableBeacon: true,
                content: <div>
                    We keep track of the time a document
                    was <Term>added</Term> and <Term>updated</Term> so
                    you can sort by time to read the most recently added (or
                    updated) documents first.
                </div>,
                // placement: "bottom",
            },

            {
                target: '.doc-table-col-title',
                disableBeacon: true,
                content: <div>
                    The title of the document is automatically set when it's
                    added but you can change it at any time
                </div>,
                // placement: "bottom",
            },

            {
                target: '.doc-table-col-mutate-tags',
                disableBeacon: true,
                content: <div>
                    The <Term>tag</Term> button allow you to assign new <b><i>tags</i></b> a document
                </div>,
                // placement: "bottom",
            },

            {
                target: '.doc-table-col-mutate-flags',
                disableBeacon: true,
                content: <div>
                    The <Term>flag</Term> button allow you to mark important
                    documents.  Once flagged you can use the <Term>filter bar</Term> to
                    show only flagged documents.
                </div>,
                // placement: "bottom",
            },

            {
                target: '.doc-table-col-mutate-archived',
                disableBeacon: true,
                content: <div>This <Term>archive</Term> allow you to hide a document once read.</div>,
                // placement: "bottom",
            },

            {
                target: '.doc-dropdown',
                disableBeacon: true,
                content:  <div>
                    The dropdown allow you perform other actions on a document
                    including changing the title and deleting documents.
                </div>,
                // placement: "bottom",
            },

            {
                title: <Title>Filter Bar</Title>,
                target: '#toggle-flagged',
                disableBeacon: true,
                content: <div>The <Term>filter bar</Term> allows you to
                    configure which documents are visible.
                    This button allows you to hide/show <Term>flagged</Term> documents.
                </div>,
            },

            {
                target: '#toggle-archived',
                disableBeacon: true,
                content: <div>
                    Toggle <Term>archived</Term> documents (hidden by default).  It's usually
                    best to archive a document after it's been read.
                </div>,
            },

            {
                target: '#filter-tag-input',
                disableBeacon: true,
                content: <div>
                    The tag filter allows you to narrow down the
                    list of documents by tag.</div>,
            },
            {
                target: '#filter_title',
                content: 'Search the list of documents by title.',
                disableBeacon: true,
            },
            //
            // {
            //     // target: '#doc-repo-table .rt-tbody > div:nth-child(-n+4)',
            //     target: '#doc-repo-table .rt-tbody > div:nth-child(-n+1)',
            //     title: <Title>Open a document</Title>,
            //     disableBeacon: true,
            //     spotlightClicks: true,
            //     content: <div>
            //
            //         <i className="fas fa-book-open text-primary"
            //            style={{fontSize: '150px'}}></i>
            //
            //         <p>
            //             Let's open a document.
            //         </p>
            //
            //         <p>
            //             Go ahead and <Term>double click</Term> on the
            //             highlighted document row and a new window will open.
            //         </p>
            //
            //     </div>,
            //     // placement: "bottom",
            // },
            {
                id: 'expand-sidebar-for-stats',
                target: '#toggle-sidebar',
                content: 'Click this',
                spotlightClicks: true,
                disableBeacon: true,
                placement: 'right',
                hideFooter: true
            },
            {
                id: 'select-sidebar',
                target: '#sidebar-item-stats',
                content: 'Now click this for the siebar',
                spotlightClicks: true,
                disableBeacon: true,
                placement: 'right',
                hideFooter: true
            },


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

        return (

            <Joyride
                steps={steps}
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

    private onAppActivity(appActivity: AppActivity<any>) {

        console.log("FIXME: onAppActivity: " , appActivity);

        this.doStep(this.callback!);

        // FIXME: if the current step is


    }

    private onCallback(callback: CallBackProps): void {

        console.log("FIXME: onCallback: " , callback);

        this.callback = callback;

        RendererAnalytics.event({category: 'tour', action: 'did-step-' + callback.index});

        if (callback.status === STATUS.SKIPPED || callback.status === STATUS.FINISHED) {

            try {

                switch (callback.status) {
                    case STATUS.SKIPPED:
                        RendererAnalytics.event({category: 'tour-result', action: 'skipped'});
                        RendererAnalytics.event({category: 'tour-skip', action: 'skipped-at-step-' + callback.index});

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

        } else if (callback.type === EVENTS.STEP_AFTER) {

            this.doStep(callback);

        } else if (callback.type === EVENTS.TARGET_NOT_FOUND) {
            log.warn("Not found: ", callback);

            this.doStep(callback);
        }

    }

    private doStep(data: CallBackProps) {

        this.setState({...this.state,
                          stepIndex: this.state.stepIndex + (data.action === ACTIONS.PREV ? -1 : 1) });

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
}
