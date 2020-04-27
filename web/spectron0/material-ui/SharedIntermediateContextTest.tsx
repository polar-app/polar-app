import React, {useCallback, useState, useRef} from "react";
import Button from "@material-ui/core/Button";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {useSharedState} from "../../js/hooks/use-shared-state";
import {DeepEquals} from "./doc_repo_table/DeepEquals";
import debugIsEqual = DeepEquals.debugIsEqual;

interface IContext {
    readonly value: number;
    readonly doIncr: () => void;
}

const ValueContext = React.createContext<IContext>({
    value: 0,
    doIncr: NULL_FUNCTION
});

interface IProps {

}
// const ChildComponent = React.memo(() => {
//
//     const context = React.useContext(ValueContext);
//
//     console.log("ChildComponent: render");
//
//     return (
//         <>
//             value is: {context.value}
//             <Button variant="contained"
//                     color="primary"
//                     onClick={() => context.setValue(context.value + 1)}>
//                 Update
//             </Button>
//         </>
//     )
//
// }, debugIsEqual);

const ChildComponent = () => {

    const context = React.useContext(ValueContext);

    console.log("ChildComponent: render");

    return (
        <>
            value is: {context.value}
            <Button variant="contained"
                    color="primary"
                    onClick={() => context.doIncr()}>
                Update
            </Button>
        </>
    )

};

const IntermediateComponent = React.memo(() => {
    console.log("IntermediateComponent: render");

    return (
        <ChildComponent/>
    );

}, debugIsEqual);

interface IState {
    readonly iter: number;
}

export const SharedIntermediateContextTest = () => {


    // FIXME see if I can refactor this into a useStore function
    const ref = useRef(1);
    const iter = useRef(1);
    const [state, setState] = useState({iter: 0});

    // FIXME: this updates all child components, recursively...
    // FIXME: react context API just allows you to avoid passing props, it does
    // not prevent components from re-rendering... we must use pure components
    // for this...

    // FIXME: is there a better way to do this ? to create a core object, which
    // is re-used, and the nstate updated, and only teh context of those objects
    // updated

    // FIXME: this DOES work but we need a way to use state...
    const doIncr = useCallback(() => {
        console.log("ref: ", ref);
        console.log("iter: ", iter);
        ref.current = ref.current + 1;
        iter.current = iter.current + 1;
        setState({iter: iter.current});

    }, []);

    console.log("SharedStateTest: render: iter: ", iter);

    return (
        <ValueContext.Provider value={{value: ref.current, doIncr}}>
            <IntermediateComponent/>
        </ValueContext.Provider>
    )

};
