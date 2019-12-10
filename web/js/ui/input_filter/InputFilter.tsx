import React from 'react';
import {FilterIcon, TimesIcon} from "../icons/FixedWidthIcons";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Button} from "reactstrap";
import {ResetButton} from "./ResetButton";
import {FocusInput} from "./FocusInput";

/**
 * Text input widget that allow the user to filter their input.
 */
export class InputFilter extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.setValue = this.setValue.bind(this);

        this.state = {
            value: "",
        };

    }

    public render() {

        const clear = () => {
            console.log("clear");
            this.setValue("");
        };

        const ClearButton = () => {

            if (this.state.value !== "") {
                return (
                    <ResetButton onClick={() => clear()}/>
                );

            }

            return null;

        };

        // TODO: ideally we would have a 'clear' button to reset the input but we have
        // two problems with it:
        //
        //
        // - setting the value in the state doesn't work
        // - when we have onFocus onBlur methods the click event doesn't fire
        //
        // - this is probably happening because the focus is setting teh state , then
        //   we click button but it's not there or somethign like that...

        return <FocusInput style={{...this.props.style}}>
            <div className={"pl-1 pt-1 pb-1"}
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
                       className="border-0"
                       onChange={event => this.setValue(event.target.value)}
                       style={{
                           flexGrow: 1,
                           outline: 'none'
                       }}/>

                {/*<ClearButton/>*/}

            </div>
        </FocusInput>;

    }

    private setValue(value: string) {

        const onChange = this.props.onChange || NULL_FUNCTION;
        onChange(value);

        this.setState({
            ...this.state,
            value
        });

    }

}

interface IProps {
    readonly id?: string;

    readonly style?: React.CSSProperties;

    /**
     * The changed value or undefined if it has been cleared.
     */
    readonly onChange?: (value: string) => void;

    readonly placeholder?: string;

    readonly defaultValue?: string;

}

interface IState {
    readonly value: string;
}
