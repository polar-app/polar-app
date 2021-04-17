import * as React from 'react';
import {DataLoader} from "../data_loader/DataLoader";
import {MemoryLogger} from "../../logger/MemoryLogger";
import {LogLevelName} from "../../logger/Logging";
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Arrays} from "polar-shared/src/util/Arrays";
import {IDStr} from "polar-shared/src/util/Strings";

export class LogMessagesDataLoader extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const provider = (onNext: (messages: LogData) => void) => {

            let buffer: LogMessage[] = [];

            const releasable = MemoryLogger.addEventListener(event => {

                buffer.push({
                    id: "idx:" + event.idx,
                    timestamp: event.timestamp,
                    level: event.level,
                    msg: event.msg
                });

                buffer = Arrays.head(buffer, 3);

                const logData: LogData = {
                    messages: [...buffer]
                };

                onNext(logData);

            });

            return () => {
                // return a function that can be released;
                releasable.release();
            };

        };

        return (
            <DataLoader id="log-messages"
                        provider={provider}
                        render={(messages) => this.props.render(messages)}/>
        );
    }

}

export interface LogMessage {
    readonly id: IDStr;
    readonly timestamp: ISODateTimeString;
    readonly level: LogLevelName;
    readonly msg: string;
}

export interface LogData {
    readonly messages: ReadonlyArray<LogMessage>;
}

export interface IProps {
    readonly render: (messages: LogData | undefined) => React.ReactElement;
}

export interface IState {
}
