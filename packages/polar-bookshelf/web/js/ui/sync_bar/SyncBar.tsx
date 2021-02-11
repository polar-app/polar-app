import React from 'react';
import {IStyleMap} from '../../react/IStyleMap';
import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {EventListener} from '../../reactor/EventListener';
import {Logger} from 'polar-shared/src/logger/Logger';
import LinearProgress from '@material-ui/core/LinearProgress';

const log = Logger.create();

const Styles: IStyleMap = {

    root: {

    },

    textBox: {
        position: 'fixed',
        left: '0',
        bottom: '5px',
        padding: '2px',
        fontSize: '12px',
        backgroundColor: '#F0F0EF',
        borderColor: '#D4D4D4',
        borderRadius: '0px 5px 0px 0px',
        minWidth: '250px',
        userSelect: 'none',
        zIndex: 99999999999,
    },

};

export class SyncBar extends React.Component<IProps, IState> {

    private listener?: EventListener<SyncBarProgress>;

    constructor(props: IProps) {
        super(props);

        this.onProgress = this.onProgress.bind(this);

        this.state = {
            progress: undefined
        };

    }

    public componentDidMount(): void {

        if (this.props.progress) {
            this.props.progress.addEventListener(progress => {

                log.info(`${progress.percentage}: ${progress.message}`);

                this.onProgress(progress);
            });
        }

    }


    public componentWillUnmount(): void {

        if (this.listener && this.props.progress) {
            this.props.progress.removeEventListener(this.listener);
        }

    }

    public render() {

        const progress = Math.floor(this.state.progress || 0);

        const isOpen = progress !== 0;

        if (! isOpen) {
            return null;
        }

        return (

            <div style={Styles.root} className="">

                <div style={Styles.textBox} className="border-top border-right">
                    {this.state.message}
                </div>

                {/*the title string doesn't render properly and looks horrible*/}
                <LinearProgress variant="determinate"
                                value={progress}/>

            </div>

        );
    }

    private onProgress(progress: SyncBarProgress) {
        this.setState({
            progress: progress.percentage,
            message: progress.message
        });
    }

}

interface IProps {

    progress?: IEventDispatcher<SyncBarProgress>;

}

interface IState {

    // initially there is no progress to display
    progress?: number;

    // the message to dispaly in the box.  If any.
    message?: string;

}

export interface SyncBarProgress {

    readonly task: string;
    readonly message?: string;
    readonly percentage: number;

}
