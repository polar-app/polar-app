import * as React from 'react';
import {TakeExtendedSurveyButton} from './TakeExtendedSurveyButton';
import {Analytics} from "../../analytics/Analytics";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";

export class Suggestions extends React.Component<IProps, IState> {

    private value: string = "";

    constructor(props: any, context: any) {
        super(props, context);

        this.onDone = this.onDone.bind(this);
        this.onCancel = this.onCancel.bind(this);

        this.state = {
            completed: false
        };

    }

    public render() {

        const Description = () => {

            if (this.props.description) {
                return this.props.description;
            } else {
                return null;
            }

        };

        const Form = () => {

            return <div style={{
                            position: 'fixed',
                            bottom: 25,
                            zIndex: 9999,
                            width: '100%'
                        }}
                        className="">

                <div style={{
                         width: '600px',
                         backgroundColor: "var(--primary-background-color)"
                     }}
                     className="border rounded shadow p-3 ml-auto mr-auto">

                    <h3>{this.props.title}</h3>

                    <div className="ml-auto mr-auto">
                        <Description/>
                    </div>

                    <Input type="textarea"
                           onChange={event => this.value = event.target.value}
                           style={{height: '8em'}}/>

                    <div className="mt-2" style={{display: 'flex'}}>

                        <div className="ml-auto">

                            <TakeExtendedSurveyButton/>

                            <Button variant="contained"
                                    onClick={() => this.onCancel()}>Cancel</Button>

                            <Button color="primary"
                                    variant="contained"
                                    className="ml-1"
                                    onClick={() => this.onDone()}>Send Feedback</Button>

                        </div>

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

    private onCancel() {

        if (! this.props.noEvent) {

            Analytics.event({
                category: this.props.category,
                action: 'cancel-suggestion',
            });

        }

        this.markCompleted();

    }

    private onDone() {

        if (! this.props.noEvent) {

            Analytics.event({
                category: this.props.category,
                action: 'sent-suggestion',
            });

        }

        this.markCompleted();

        if (this.props.onDone) {
            this.props.onDone(this.value);
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

    readonly description?: React.ReactElement;

    /**
     * Don't send the event on form submission.  Just for testing.
     */
    readonly noEvent?: boolean;

    readonly onDone?: (text: string) => void;

}

export interface IState {
    readonly completed: boolean;
}

