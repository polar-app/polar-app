import * as React from 'react';
import {Button, Form, FormGroup, FormText, Input, Label} from "reactstrap";
import {ColorButton} from "../../js/ui/colors/ColorButton";

const ExampleForm = () => {


    return (
        <Form>
            <h1>Forms</h1>
            <FormGroup>
                <Label for="exampleEmail">Email</Label>
                <Input type="email" name="email" id="exampleEmail" placeholder="with a placeholder" />
            </FormGroup>
            <FormGroup>
                <Label for="examplePassword">Password</Label>
                <Input type="password" name="password" id="examplePassword" placeholder="password placeholder" />
            </FormGroup>
            <FormGroup>
                <Label for="exampleSelect">Select</Label>
                <Input type="select" name="select" id="exampleSelect">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </Input>
            </FormGroup>
            <FormGroup>
                <Label for="exampleSelectMulti">Select Multiple</Label>
                <Input type="select" name="selectMulti" id="exampleSelectMulti" multiple>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </Input>
            </FormGroup>
            <FormGroup>
                <Label for="exampleText">Text Area</Label>
                <Input type="textarea" name="text" id="exampleText" />
            </FormGroup>
            <FormGroup>
                <Label for="exampleFile">File</Label>
                <Input type="file" name="file" id="exampleFile" />
                <FormText color="muted">
                    This is some placeholder block-level help text for the above input.
                    It's a bit lighter and easily wraps to a new line.
                </FormText>
            </FormGroup>
            <FormGroup tag="fieldset">
                <legend>Radio Buttons</legend>
                <FormGroup check>
                    <Label check>
                        <Input type="radio" name="radio1" />{' '}
                        Option one is this and that—be sure to include why it's great
                    </Label>
                </FormGroup>
                <FormGroup check>
                    <Label check>
                        <Input type="radio" name="radio1" />{' '}
                        Option two can be something else and selecting it will deselect option one
                    </Label>
                </FormGroup>
                <FormGroup check disabled>
                    <Label check>
                        <Input type="radio" name="radio1" disabled />{' '}
                        Option three is disabled
                    </Label>
                </FormGroup>
            </FormGroup>
            <FormGroup check>
                <Label check>
                    <Input type="checkbox" />{' '}
                    Check me out
                </Label>
            </FormGroup>
            <Button>Submit</Button>
        </Form>
    );
};

const ExampleButtons = () => {

    const colors = ['primary', 'secondary', 'success', 'info', "warning", "danger", "link", "light", undefined];

    return <div>

        <h1>Buttons</h1>

        <h2>Regular buttons</h2>

        <div className="children-margin">
            {colors.map(color => <Button size="md" color={color}>{color || 'no color'}</Button>)}
        </div>

        <h2>Outline</h2>

        <div className="children-margin">
            {colors.map(color => <Button size="md" color={color} outline>{color || 'no color'}</Button>)}
        </div>

    </div>;

};

const Colors = () => {

    interface ColorProps {
        readonly name: string;
    }

    const Color = (props: ColorProps) =>
        <div style={{display: 'flex'}} className="mt-1">
            <div style={{
                    width: '20em',
                 }}>
                {props.name}
            </div>

            <div style={{
                    width: '15em',
                    backgroundColor: 'var(--' + props.name + ')'
                 }}>
                &nbsp;
            </div>
        </div>;

    return <div>

        <h1>Colors</h1>
        <Color name="primary-background-color"/>
        <Color name="primary-text-color"/>
        <Color name="selected-background-color"/>
        <Color name="selected-text-color"/>
        <Color name="success"/>
        <Color name="primary"/>
        <Color name="secondary"/>
        <Color name="info"/>
        <Color name="danger"/>
    </div>;

};

const ExampleBorders = () => {

    return <div>

    </div>;

};

export class UIComponents extends React.Component<IProps, IState> {

    public render() {

        return (

            <div className="m-1">

                <Colors/>

                <ExampleForm/>

                <ExampleButtons/>

            </div>

        );

    }

}


interface IProps {
}

interface IState {
}


