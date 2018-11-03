/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {IStyleMap} from '../../react/IStyleMap';
import {Progress} from 'reactstrap';
import {Reactor} from '../../reactor/Reactor';
import Collapse from 'reactstrap/lib/Collapse';


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
        borderRadius: '0px 5px 0px 0px'
    },

    progress: {

        position: 'fixed',
        left: '0',
        bottom: '0',
        minWidth: '100%',
        zIndex: 99999999999,
        height: '5px',

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

        const isOpen = progress !== 0 && progress !== 100;

        return (

            <div style={Styles.root} className="">

                <Collapse timeout={0} isOpen={isOpen}>

                    <div style={Styles.textBox} className="border-top border-right">
                        Synchronizing anki: 15/20 cards copied...
                    </div>

                    {/*the title string doesn't render properly and looks horrible*/}
                    <Progress style={Styles.progress}
                              className="rounded-0 border-top border-left border-secondary progress-bar-striped"
                              value={progress}>
                        {/*{Math.floor(progress)}%*/}
                    </Progress>

                </Collapse>

            </div>

        );
    }


}

interface IProps {

    progress?: Reactor<SyncBarProgress>;

}

interface IState {
    progress: number;
}

export interface SyncBarProgress {

    readonly task: string;
    readonly title?: string;
    readonly percentage: number;

}
