import {useDocViewerCallbacks, useDocViewerStore} from "../DocViewerStore";
import * as React from "react";
import {useState} from "react";
import TextField from "@material-ui/core/TextField";
import {deepMemo} from "../../../../web/js/react/ReactUtils";

interface IProps {
    readonly nrPages: number;
}

interface IState {
    readonly changing: boolean;
    readonly value: string;
}

export const PageNumberInput = deepMemo(function PageNumberInput(props: IProps) {

    const {page, pageNavigator} = useDocViewerStore(['page', 'pageNavigator']);
    const {onPageJump} = useDocViewerCallbacks();
    const ref = React.useRef<HTMLElement | null>();

    // yield to the property, except if we're changing the value, then jump
    // to the right value, and then blur the element...

    const numberToString = React.useCallback((value: number | undefined): string => {

        if (value) {
            return value.toString();
        }

        return '';

    }, []);

    const [state, setState] = useState<IState>({
        changing: false,
        value: ''
    });

    const value = state.changing ? state.value : numberToString(page);

    const resetState = React.useCallback(() => {
        setState({
           changing: false,
           value: ''
       });
    }, []);

    const parsePage = React.useCallback((): number | undefined => {

        try {

            const page = parseInt(value);

            if (page <= 0 || page > (props.nrPages || 0)) {
                return undefined;
            }

            return page;

        } catch (e) {
            return undefined;
        }

    }, [props.nrPages, value]);

    const onEnter = React.useCallback(() => {

        const newPage = parsePage();

        if (newPage) {
            onPageJump(newPage);
        }

        if (document.activeElement) {
            const blurElement = document.activeElement as any;
            if (blurElement && blurElement.blur) {
                blurElement.blur();
            }
        }

    }, [onPageJump, parsePage]);

    const handleKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLElement>) => {

        // note that react-hotkeys is broken when you listen to 'Enter' on
        // ObserveKeys when using an <input> but it doesn't matter because we can
        // just listen to the key directly

        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
            // Make sure NO other modifiers are enabled.. ctrl+escape for example.
            return;
        }

        switch (event.key) {

            case 'Enter':
                onEnter();
                break;

        }

    }, [onEnter]);

    const handleChange = React.useCallback((val: string) => {
        setState({changing: true, value: val});
    }, []);

    const handleBlur = React.useCallback(() => {
        resetState();
    }, [resetState]);

    return (
        <div style={{
                 maxWidth: '5em'
             }}
             className="mt-auto mb-auto">

            <TextField value={value}
                       innerRef={ref}
                       onChange={event => handleChange(event.currentTarget.value)}
                       disabled={!pageNavigator || pageNavigator.count <= 1}
                       onBlur={() => handleBlur()}
                       onKeyDown={event => handleKeyDown(event)}
                       type="text"
                       size="small"
                       variant="outlined"
                       inputProps={{
                           style: {
                               textAlign: "right"
                           }
                       }}
                       style={{
                           width: '5em',
                       }}/>
        </div>

    );

});
