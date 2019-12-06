import React from 'react';
import {FilterIcon} from "../icons/FixedWidthIcons";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

/**
 * Text input widget that allow the user to filter their input.
 */
export class InputFilter extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.setFocused = this.setFocused.bind(this);

        this.state = {
            focused: false
        };

    }

    public render() {

        const onChange = this.props.onChange || NULL_FUNCTION;

        const borderClass = this.state.focused ? 'border-primary' : 'border-muted';

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
                   defaultValue={this.props.defaultValue}
                   className="border-0 text-muted"
                   onChange={event => onChange(event)}
                   style={{
                       flexGrow: 1,
                       outline: 'none'
                   }}/>

        </div>;

    }

    private setFocused(focused: boolean) {
        this.setState({focused});
    }

}

interface IProps {
    readonly id?: string;
    readonly onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    readonly placeholder?: string;
    readonly defaultValue?: string;
}

interface IState {
    readonly focused?: boolean;
}
