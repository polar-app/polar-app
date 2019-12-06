import React from 'react';
import {FilterIcon, TimesIcon} from "../icons/FixedWidthIcons";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Button} from "reactstrap";

/**
 * Text input widget that allow the user to filter their input.
 */
export class InputFilter extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.setValue = this.setValue.bind(this);
        this.setFocused = this.setFocused.bind(this);

        this.state = {
            focused: false,
            value: ""
        };

    }

    public render() {

        const borderClass = this.state.focused ? 'border-primary' : 'border-muted';

        const clear = () => this.setValue("");

        const ClearButton = () => {

            if (this.state.value !== "") {
                return (
                    <Button className="mt-auto mb-auto text-secondary p-0 no-focus"
                            style={{outline: 'none', boxShadow: 'none'}}
                            onClick={() => console.log("FIXME clear")}
                            color="clear">

                        <TimesIcon/>

                    </Button>
                );

            }

            return null;

        };

        return <div className={"p-1 pl-1 border rounded " + borderClass}
                    onFocus={() => this.setFocused(true)}
                    onBlur={() => this.setFocused(false)}
                    style={{
                        display: 'flex'
                    }}>

            <div className="mt-auto mb-auto text-secondary">
                <FilterIcon/>
            </div>

            <input id={this.props.id}
                   placeholder={this.props.placeholder}
                   value={this.state.value}
                   defaultValue={this.props.defaultValue}
                   className="border-0 text-muted"
                   onChange={event => this.setValue(event.target.value)}
                   style={{
                       flexGrow: 1,
                       outline: 'none'
                   }}/>

           {/*<ClearButton/>*/}

        </div>;

    }

    private setValue(value: string) {

        const onChange = this.props.onChange || NULL_FUNCTION;
        onChange(value);

        this.setState({
            ...this.state,
            value
        });
    }

    private setFocused(focused: boolean) {

        this.setState({
            ...this.state,
            focused
        });

    }

}

interface IProps {
    readonly id?: string;

    /**
     * The changed value or undefined if it has been cleared.
     */
    readonly onChange?: (value: string) => void;

    readonly placeholder?: string;

    readonly defaultValue?: string;

}

interface IState {
    readonly focused?: boolean;
    readonly value: string;
}
