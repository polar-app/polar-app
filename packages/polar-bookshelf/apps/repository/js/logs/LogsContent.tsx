import * as React from 'react';
import ReactJson from 'react-json-view';
import {useComponentDidMount} from "../../../../web/js/hooks/ReactLifecycleHooks";
import {ConsoleRecorder} from "polar-shared/src/util/ConsoleRecorder";
import { isPresent } from 'polar-shared/src/Preconditions';

class Styles {

    public static LogMessage: React.CSSProperties = {
        display: 'flex',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
    };

    public static LogFieldTimestamp: React.CSSProperties = {
        fontWeight: 'bold',
        fontFamily: 'Courier New, monospace',
        marginRight: '5px',
        whiteSpace: 'nowrap',
    };

    public static LogFieldMsg: React.CSSProperties = {
        fontFamily: 'Courier New, monospace',
        whiteSpace: 'nowrap',
        overflow: 'none'
    };

    public static LogFieldArgs: React.CSSProperties = {
        marginLeft: '5px'
    };

    public static Level: React.CSSProperties = {
        marginRight: '5px'
    };

}

export const LogsContent = () => {

    const messages = ConsoleRecorder.snapshot();

    useComponentDidMount(() => {
        // noop
    })

    const argsRequireRender = (args: any): boolean => {

        if (isPresent(args)) {

            if (Array.isArray(args)) {

                if (args.length > 0) {
                    return true;
                } else {
                    return false;
                }

            }

            return true;

        }

        return false;

    };

    const siblings = [...messages].reverse().map((current, idx) => {

        let className = "";

        if (current.level === 'warn') {
            className = 'alert-warning';
        }

        if (current.level === 'error') {
            className = 'alert-danger';
        }

        interface RenderParamProps {
            readonly value: any;
        }

        const RenderParam = (props: RenderParamProps) => {

            const {value} = props;

            if (typeof value === 'string' || typeof value === 'number') {
                return <>{value}</>
            }

            return (
                <ReactJson src={current.params}
                           theme='twilight'
                           shouldCollapse={() => true}/>
            )

        }

        const doRenderArgs = argsRequireRender(current.params);

        return (
            <div style={Styles.LogMessage} className={className} key={idx}>

                <div style={Styles.LogFieldTimestamp}>{current.created}</div>
                <div style={Styles.Level}>{current.level}</div>
                <div style={Styles.LogFieldMsg}>{current.message}</div>

                {doRenderArgs && current.params.map((current: any, idx: number) => (
                    <RenderParam key={idx} value={current}/>))}

            </div>
        );
   });

   return (
       <>{siblings}</>
   )

}
