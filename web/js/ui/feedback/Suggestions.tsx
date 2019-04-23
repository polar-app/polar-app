import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import Input from 'reactstrap/lib/Input';
import {TakeExtendedSurveyButton} from './TakeExtendedSurveyButton';

export class Suggestions extends React.Component<IProps, IState> {

    constructor(props: any, context: any) {
        super(props, context);

        this.onDone = this.onDone.bind(this);

        this.state = {
            completed: false
        };

    }

    public render() {

        const Description = () => {

            if (this.props.description) {
                return <p className="text-center">{this.props.description}</p>;
            } else {
                return <div></div>;
            }

        };

        const Form = () => {

            return <div style={{
                            width: '600px',
                            position: 'fixed',
                            right: 25,
                            bottom: 25,
                            zIndex: 9999,
                        }}
                        className="border rounded shadow bg-white p-3">

                <h3 className="text-center">{this.props.title}</h3>

                <div className="ml-auto mr-auto">
                    <Description/>
                </div>

                <Input type="textarea"
                       autofocus
                       style={{height: '8em'}}/>


                <div className="mt-2" style={{display: 'flex'}}>

                    <div className="ml-auto">

                        <TakeExtendedSurveyButton/>

                        <Button size="md"
                                color="primary"
                                onClick={() => this.onDone()}>Send Feedback</Button>

                    </div>

                </div>

            </div>;

        };

        if (this.state.completed) {
            return <div/>;
        } else {
            return <Form/>;
        }

    }

    private onDone() {

        if (! this.props.noEvent) {

            // RendererAnalytics.event({
            //     category: this.props.category,
            //     action: `${rating}`,
            //     value: rating
            // });

            // console.log(`Sent feedback for category ${this.props.category}:
            // ${rating}`);

        }

        this.markCompleted();

        if (this.props.onDone) {
            this.props.onDone();
        }

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
     * Don't send the event on form submission.  Just for testing.
     */
    readonly noEvent?: boolean;

    readonly onDone?: () => void;

}

export interface IState {
    readonly completed: boolean;
}

