import Joyride, {CallBackProps, Step, STATUS} from 'react-joyride';
import * as React from 'react';
import {LifecycleToggle} from '../../ui/util/LifecycleToggle';
import {LifecycleEvents} from '../../ui/util/LifecycleEvents';
import {RendererAnalytics} from '../../ga/RendererAnalytics';

export class Styles {

    public static IMG: React.CSSProperties = {
        maxWidth: '450px',
        maxHeight: '325px',
        marginBottom: '10px',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
    };

}

export class ViewerTour extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onCallback = this.onCallback.bind(this);

        this.state = {
        };

    }

    public render() {

        const Term = (props: any) => {
            return <b><i>{props.children}</i></b>;
        };

        const Title = (props: any) => {
            return <div style={{fontSize: '22px'}}>{props.children}</div>;
        };

        const steps: Step[] = [
            {
                target: 'body',
                content: <div>
                    <h2>Document Viewer</h2>

                    <img src="/web/assets/images/doc.svg" style={Styles.IMG}/>

                    <p>
                        This is the main document viewer and allows you to both
                        view and <Term>annotate</Term> documents.
                    </p>

                    <p>It supports the following features: </p>

                    <ul>
                        <li>Keeping track of your reading with pagemarks.</li>
                        <li>Highlighting text within the document</li>
                        <li>Creating comments and flashcards attached to these highlights.</li>
                    </ul>

                </div>,
                styles: {
                    tooltip: {
                        width: '650px'
                    }
                },
                disableBeacon: true,
                placement: 'center'
            },

            {
                target: '.polar-sidebar',
                title: <Title>Annotation Sidebar</Title>,
                disableBeacon: true,
                placement: 'left-start',
                content: <div>

                    <p>

                        The <Term>annotation sidebar</Term> lists all
                        annotations on the current document including highlights
                        , comments, and flashcards.
                    </p>

               </div>
            },
            {
                target: '#polar-progress',
                title: <Title>Progress Bar</Title>,
                disableBeacon: true,
                content: <div>

                    <p>
                        The <Term>progress bar</Term> keeps track of how much
                        of the document you've read by using <Term>pagemarks</Term>.
                    </p>

                    <p>
                        Pagemarks are manually created while reading documents.
                    </p>

                </div>
            },



        ];

        return (

            <Joyride
                steps={steps}
                continuous={true}
                callback={data => this.onCallback(data)}
                run={! LifecycleToggle.isMarked(LifecycleEvents.TOUR_TERMINATED)}
                showProgress={true}
                showSkipButton={true}
                styles={{
                    options: {
                        // arrowColor: '#e3ffeb',
                        // backgroundColor: '#e3ffeb',
                        // overlayColor: 'rgba(79, 26, 0, 0.4)',
                        primaryColor: '#007bff',
                        // textColor: '#004a14',
                        // width: 900,
                        zIndex: 999999999,
                    },
                    tooltipContainer: {
                        textAlign: 'left',
                    }
                }}
            />

        );

    }

    private onCallback(data: CallBackProps): void {

        RendererAnalytics.event({category: 'tour', action: 'did-step-' + data.index});

        if (data.status === STATUS.SKIPPED || data.status === STATUS.FINISHED) {

            try {

                // switch (data.status) {
                //     case STATUS.SKIPPED:
                //         RendererAnalytics.event({category: 'tour-result', action: 'skipped'});
                //         RendererAnalytics.event({category: 'tour-skip', action: 'skipped-at-step-' + data.index});
                //
                //         LifecycleToggle.mark(LifecycleEvents.TOUR_SKIPPED);
                //         break;
                //     case STATUS.FINISHED:
                //         RendererAnalytics.event({category: 'tour-result', action: 'finished'});
                //
                //         LifecycleToggle.mark(LifecycleEvents.TOUR_FINISHED);
                //         break;
                // }
                //

            } finally {
                LifecycleToggle.mark(LifecycleEvents.TOUR_TERMINATED);
            }

        }

    }

}

export interface IProps {

}

export interface IState {

}
