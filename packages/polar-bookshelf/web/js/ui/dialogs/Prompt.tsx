import React from 'react';
import {Button} from 'reactstrap';
import Label from 'reactstrap/lib/Label';
import Input from 'reactstrap/lib/Input';
import {DialogContainer} from './DialogContainer';
import {InputValidator} from './InputValidators';
import {NULL_INPUT_VALIDATOR} from './InputValidators';
import {InvalidInput} from './InputValidators';

/**
 * Ask the user for a text string
 */
export class Prompt extends React.PureComponent<PromptProps, IState> {

    private value: string = '';

    constructor(props: PromptProps) {
        super(props);

        this.onCancel = this.onCancel.bind(this);
        this.onDone = this.onDone.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);

        this.state = {

        };

    }

    public render() {

        const id = 'prompt-' + Math.floor(10000 * Math.random());

        const {validation} = this.state;

        const InputValidationMessage = () => {

            if (validation) {
                return <div className="mt-1 mb-1">
                    <div className="alert alert-danger p-1" role="alert">
                        {validation.message}
                    </div>
                </div>;
            } else {
                return <div/>;
            }

        };

        const Description = () => {

            if (this.props.description) {
                return <p>{this.props.description}</p>;
            } else {
                return null;
            }

        };

        return (

            <DialogContainer open={true}>

               <div className="p-3">

                   <InputValidationMessage/>

                   <Label className="font-weight-bold"
                          for={id}>
                       <h4>{this.props.title}</h4>
                   </Label>

                   <Description/>

                   <div className="mt-1 mb-3" style={{display: 'flex'}}>

                       <Input type="text"
                              name={id}
                              id={id}
                              style={{
                                  width: '450px',
                                  maxWidth: '100vh',
                                  flexGrow: 1
                              }}
                              onKeyDown={event => this.onKeyDown(event)}
                              defaultValue={this.props.defaultValue  || ''}
                              onChange={(event) => this.value = event.target.value}
                              autoFocus
                              placeholder={this.props.placeholder || ''}/>
                   </div>

                    <div className="text-right">

                        <Button color="clear"
                                size="lg"
                                className=""
                                onClick={() => this.onCancel()}>Cancel</Button>

                        <Button color="primary"
                                size="lg"
                                className="ml-1"
                                onClick={() => this.onDone(this.value)}>Done</Button>

                    </div>
               </div>

            </DialogContainer>

        );
    }

    private onKeyDown(event: React.KeyboardEvent<HTMLElement>) {

        if (event.key === "Enter") {
            this.onDone(this.value);
        }

        if (event.key === "Escape") {
            this.onCancel();
        }

    }

    private onCancel(): void {
        this.props.onCancel();
    }

    private onDone(value: string): void {

        const validator = this.props.validator || NULL_INPUT_VALIDATOR;

        const validation = validator(value);

        if (validation) {
            this.setState({validation});
            return;
        }

        this.props.onDone(value);
    }

}

export interface PromptProps {
    title: string;
    description?: string;
    defaultValue?: string;
    placeholder?: string;
    validator?: InputValidator;
    onCancel: () => void;
    onDone: (value: string) => void;
}

interface IState {
    readonly validation?: InvalidInput;
}

