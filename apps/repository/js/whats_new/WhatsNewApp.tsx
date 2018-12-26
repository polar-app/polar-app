import * as React from 'react';
import {Logger} from '../../../../web/js/logger/Logger';
import {RepoSidebar} from '../RepoSidebar';
import {WhatsNewContent} from '../splash/splashes/whats_new/WhatsNewContent';

const log = Logger.create();

export default class WhatsNewApp extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        return (

            <div id="doc-repository">

                <header>

                    <RepoSidebar/>

                </header>

                <div className="container">

                    <div className="row">

                        <div className="col-lg-12">
                            <WhatsNewContent/>
                        </div>
                    </div>
                </div>

            </div>

        );
    }

}

export interface IProps {

}

export interface IState {

}
