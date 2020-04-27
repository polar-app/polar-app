import React, {useCallback, useState} from "react";
import Button from "@material-ui/core/Button";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

interface IContext {
    readonly value: number;
    readonly setValue: (value: number) => void;
}

const ValueContext = React.createContext<IContext>({value: 0, setValue: NULL_FUNCTION});

interface IProps {

}
const ChildComponent = (props: IProps) => {

    const context = React.useContext(ValueContext);

    console.log("ChildComponent: render");

    return (
        <>
            value is: {context.value}
            <Button variant="contained"
                    color="primary"
                    onClick={() => context.setValue(context.value + 1)}>
                Update
            </Button>
        </>
    )

}

const IntermediateComponent = React.memo(() => {
    console.log("IntermediateComponent: render");

    return (
        <ChildComponent/>
    );

});

export const SharedIntermediateContextTest = () => {

    const [state, setState] = useState(1);
    // const [state, setState] = useSharedState(1);

    // FIXME: this updates all child components, recursively...
    // FIXME: react context API just allows you to avoid passing props, it does
    // not prevent components from re-rendering... we must use pure components
    // for this...

    // FIXME: is there a better way to do this ? to create a core object, which
    // is re-used, and the nstate updated, and only teh context of those objects
    // updated

    const setValue = useCallback((value) => setState(value), []);

    console.log("SharedStateTest: render");

    return (
        <ValueContext.Provider value={{value: state, setValue}}>
            <IntermediateComponent/>
        </ValueContext.Provider>
    )

};
