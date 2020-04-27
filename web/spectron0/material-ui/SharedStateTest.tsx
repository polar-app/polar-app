import React, {useCallback, useState} from "react";
import Button from "@material-ui/core/Button";

interface IProps {
    readonly value: number;
    readonly setValue: (value: number) => void;

}
const ChildComponent = (props: IProps) => {

    const value = props.value;

    console.log("ChildComponent: render");

    return (
        <>
            value is: {value}
            <Button variant="contained"
                    color="primary"
                    onClick={() => props.setValue(value + 1)}>
                Update
            </Button>
        </>
    )

}

// const IntermediateComponent = () => (
//
// )

export const SharedStateTest = () => {

    const [state, setState] = useState(1);
    // const [state, setState] = useSharedState(1);

    // const getValue = useCallback(() => state, []);
    const setValue = useCallback((value) => setState(value), []);

    console.log("SharedStateTest: render");

    return (
        <ChildComponent value={state} setValue={setValue}/>
    )

};
