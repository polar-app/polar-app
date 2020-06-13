import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {MemoryLogger} from '../../../../web/js/logger/MemoryLogger';
import ReactJson from 'react-json-view';
import {useComponentDidMount} from "../../../../web/js/hooks/lifecycle";

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

    const messages = MemoryLogger.toView()

    useComponentDidMount(() => {
        // noop
    })

    // public componentWillMount(): void {
    //
    //     this.releaser.register(
    //         MemoryLogger.addEventListener(() => {
    //             this.setState({messages: MemoryLogger.toView()});
    //         })
    //     );
    //
    // }

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

    return [...messages].reverse()
                   .map(current => {

        let className = "";

        if (current.level === 'warn') {
            className = 'alert-warning';
        }

        if (current.level === 'error') {
            className = 'alert-danger';
        }

        const RenderJSON = () => {

            if (argsRenderable(current.args)) {

                return (<div style={Styles.LogFieldArgs}>
                    <ReactJson src={current.args} name={'args'} shouldCollapse={() => true}/>
                </div>);

            }

            return (<div></div>);

        };

        return <div style={Styles.LogMessage} className={className} key={current.idx}>

            <div style={Styles.LogFieldTimestamp}>{current.timestamp}</div>
            <div style={Styles.LogFieldMsg}>{current.msg}</div>

            <RenderJSON/>

        </div>;
   });

}
