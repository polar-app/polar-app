import * as React from 'react';
import Dropdown, {DropdownButton, DropdownMenu, DropdownMenuWrapper, DropdownToggle, MenuItem} from '@burtonator/react-dropdown';
import {NULL_FUNCTION} from '../../util/Functions';
import Button from 'reactstrap/lib/Button';
import {RendererAnalytics} from '../../ga/RendererAnalytics';

export class Feedback extends React.Component<IProps, IState> {

    constructor(props: any, context: any) {
        super(props, context);

        this.onFeedback = this.onFeedback.bind(this);
        this.onUnsure = this.onUnsure.bind(this);

        this.state = {
            completed: false
        };

    }

    public render() {

        interface FeedbackButtonProps {
            readonly rating: Rating;
            readonly background: string;
        }

        const Description = () => {

            if (this.props.description) {
                return <p className="text-center">{this.props.description}</p>;
            } else {
                return <div></div>;
            }

        };

        const UnsureButton = () => {

            if (this.props.unsure) {
                return <div>
                    <Button size='sm'
                            onClick={() => this.onUnsure()}>Not sure yet</Button>
                </div>;
            } else {
                return <div></div>;
            }

        };

        const FeedbackButton = (props: FeedbackButtonProps) => {

            let background = props.background;

            if (this.state.completed) {
                background = '#D8D8D8';
            }

            return <Button size='sm'
                           className="text-dark"
                           block={true}
                           disabled={this.state.completed}
                           style={{
                               width: '75px',
                               height: '35px',
                               margin: '5px',
                               display: 'block',
                               backgroundColor: background
                           }}
                           onClick={() => this.onFeedback(props.rating)}>

                {props.rating}

            </Button>;
        };

        const Thanks = () => {
            return <div className="text-center">

                <div className="text-success m-1">
                    <i style={{fontSize: '125px'}}
                       className="fas fa-check-circle"></i>
                </div>

                <h1>Thanks for your feedback!</h1>

            </div>;
        };

        const FeedbackForm = () => {
            return <div className="m-1">

                <h3>{this.props.title}</h3>

                <Description/>

                <div style={{
                    width: '400px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>

                    <div style={{
                        display: 'flex',
                        width: '400px'
                    }}>

                        <FeedbackButton rating={1}  background="rgba(255, 0, 0, 1.0)"/>

                        <FeedbackButton rating={2}  background="rgba(255, 0, 0, 0.8)"/>

                        <FeedbackButton rating={3}  background="rgba(255, 0, 0, 0.6)"/>

                        <FeedbackButton rating={4}  background="rgba(255, 0, 0, 0.4)"/>

                        <FeedbackButton rating={5}  background="rgba(255, 0, 0, 0.2)"/>

                        <FeedbackButton rating={6}  background="rgba(0, 255, 0, 0.2)"/>

                        <FeedbackButton rating={7}  background="rgba(0, 255, 0, 0.4)"/>

                        <FeedbackButton rating={8}  background="rgba(0, 255, 0, 0.6)"/>

                        <FeedbackButton rating={9}  background="rgba(0, 255, 0, 0.8)"/>

                        <FeedbackButton rating={10} background="rgba(0, 255, 0, 1.0)"/>

                    </div>

                    <div style={{
                        width: '400px',
                        display: 'flex',
                        paddingLeft: '5px',
                        paddingRight: '5px'
                    }}>

                        <span style={{}}>{this.props.from}</span>

                        <span style={{marginLeft: 'auto'}}>{this.props.to}</span>

                    </div>

                    <UnsureButton/>

                </div>

            </div>;

        };

        if (this.state.completed) {
            return <Thanks/>;
        } else {
            return <FeedbackForm/>;
        }

    }

    private onFeedback(rating: Rating) {

        if (! this.props.noEvent) {

            RendererAnalytics.event({
                category: this.props.category,
                action: `${rating}`,
                value: rating
            });

            console.log(`Sent feedback for category ${this.props.category}: ${rating}`);

        }

        this.markCompleted();

    }

    private onUnsure()  {

        if (! this.props.noEvent) {

            RendererAnalytics.event({
                category: this.props.category,
                action: `unsure`,
            });

            console.log(`Sent unsure feedback for category ${this.props.category}`);

        }

        this.markCompleted();

    }

    private markCompleted() {

        this.setState({
            completed: true
        });

    }

}

export interface IProps {

    readonly category: string;

    readonly title: string;

    readonly description?: string;

    /**
     * Text describing the minimum value.
     */
    readonly from: string;

    /**
     * Text describing the max value.
     */
    readonly to: string;

    /**
     * Don't send the event on form submission.  Just for testing.
     */
    readonly noEvent?: boolean;

    readonly onRated?: () => void;

    /**
     * When true we include a button at the bottom so that the user can skip
     * sending the feedback.
     */
    readonly unsure?: boolean;

}

export interface IState {
    readonly completed: boolean;
}

export type Rating = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
