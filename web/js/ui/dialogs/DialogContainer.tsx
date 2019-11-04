import React from 'react';
import {NullCollapse} from '../null_collapse/NullCollapse';

/**
 * Used to hold a dialog and to center it on the screen and so forth.
 */
export class DialogContainer extends React.PureComponent<ConfirmProps, IState> {

    constructor(props: any) {
        super(props);

    }

    public render() {

        return (

            <NullCollapse open={this.props.open}>

                <div className=""
                     style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex'
                    }}>

                    <div style={{
                            margin: 'auto',
                            zIndex: 100000000,
                         }}>

                        <div className="m-1 rounded"
                             style={{
                                 backgroundColor: 'var(--white)',
                                 maxWidth: '650px'
                             }}>
                            {this.props.children}
                        </div>

                    </div>

                </div>

            </NullCollapse>

        );

    }

}

export interface ConfirmProps {
    readonly open: boolean;
}

export interface IState {

}
