import React from 'react';
import {SearchIcon} from "../icons/FixedWidthIcons";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import InputGroupAddon from "reactstrap/lib/InputGroupAddon";
import InputGroup from "reactstrap/lib/InputGroup";
import Input from "reactstrap/lib/Input";
import InputGroupText from "reactstrap/lib/InputGroupText";
import {Props} from "../../react/Props";

export const InputFilter = (props: IProps) => {

    const onChange = props.onChange || NULL_FUNCTION;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = ('' + event.target.value);
        onChange(value);
    };

    return (

        <InputGroup>
            <InputGroupAddon addonType="prepend">
                <InputGroupText className="pl-1 pr-1">
                    <SearchIcon/>
                </InputGroupText>
            </InputGroupAddon>

            <Input id={props.id}
                   type="text"
                   className="btn-no-outline p-0 pl-1 pr-1"
                   placeholder={props.placeholder}
                   defaultValue={props.defaultValue}
                   onChange={event => handleChange(event)}>

            </Input>

            {/*<InputGroupAddon addonType="append">*/}
            {/*    <InputGroupText className="pl-1 pr-1 bg-transparent border-left-0">*/}
            {/*        /!*<Button color="clear"*!/*/}
            {/*        /!*        size="md"*!/*/}
            {/*        /!*        className="btn-no-outline">X</Button>*!/*/}
            {/*    </InputGroupText>*/}
            {/*</InputGroupAddon>*/}

        </InputGroup>

    );
};

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
