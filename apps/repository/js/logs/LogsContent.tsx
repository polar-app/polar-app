import * as React from 'react';
import ReactJson from 'react-json-view';
import {useComponentDidMount} from "../../../../web/js/hooks/ReactLifecycleHooks";
import {ConsoleRecorder} from "polar-shared/src/util/ConsoleRecorder";

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

}

export const LogsContent = () => {

    const messages = ConsoleRecorder.snapshot();

    useComponentDidMount(() => {
        // noop
    })

    const argsRenderable = (args: any): boolean => {

        if (args) {

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

        const RenderJSON = () => {

            if (argsRenderable(current.params)) {

                return (<div style={Styles.LogFieldArgs}>
                    <ReactJson src={current.params} name={'args'} shouldCollapse={() => true}/>
                </div>);

            }

            return (<div></div>);

        };

        return <div style={Styles.LogMessage} className={className} key={idx}>

            <div style={Styles.LogFieldTimestamp}>{current.created}</div>
            <div style={Styles.LogFieldMsg}>{current.message}</div>

            <RenderJSON/>

        </div>;
   });

   return (
       <>{siblings}</>
   )

}
