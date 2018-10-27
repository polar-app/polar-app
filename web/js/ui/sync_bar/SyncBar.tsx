/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {IStyleMap} from '../../react/IStyleMap';
import {Progress} from 'reactstrap';
import {Reactor} from '../../reactor/Reactor';
import Collapse from 'reactstrap/lib/Collapse';


const Styles: IStyleMap = {

    root: {
        position: 'fixed',
        right: '0',
        bottom: '0',
        minWidth: '250px'
    },

    icon: {
    }

};

/**
 * The sync bar is a bar in the bottom right of the page that displays sync
 * progress and can bring up a popup displaying what it is currently doing.
 */
export class SyncBar extends React.Component<IProps, IState> {

    private value: string = '';

    constructor(props: IProps) {
        super(props);

        this.state = {
            progress: 75
        };

    }

    public render() {

        const progress = Math.floor(this.state.progress);

        return (

            <div style={Styles.root} className="">

                <Collapse timeout={0} isOpen={progress !== 0 && progress !== 100}>

                    {/*the title string doesn't render properly and looks horrible*/}
                    <Progress className="rounded-0 border-top border-left border-secondary progress-bar-striped progress-bar-animated text-left"
                              value={progress}>
                        {Math.floor(progress)}%
                    </Progress>

                </Collapse>

            </div>

        );
    }


}

interface IProps {

    progress: Reactor<SyncBarProgress>

}

interface IState {
    progress: number;
}

export interface SyncBarProgress {

    readonly task: string;
    readonly title?: string;
    readonly percentage: number;

}
