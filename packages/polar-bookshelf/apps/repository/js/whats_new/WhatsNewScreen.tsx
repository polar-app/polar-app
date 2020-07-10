import * as React from 'react';
import {WhatsNewContent} from '../splash2/whats_new/WhatsNewContent';
import {FixedNav, FixedNavBody} from '../FixedNav';
import {RepoHeader} from '../repo_header/RepoHeader';

export interface IProps {
}

export interface IState {
}

export default class WhatsNewScreen extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        return (

            <FixedNav id="doc-repository">

                <header>

                    <RepoHeader/>

                </header>

                <FixedNavBody className="container-fluid">

                    <div className="row">

                        <div className="col-lg-12 w-100 pt-2">
                            <WhatsNewContent/>
                        </div>
                    </div>

                </FixedNavBody>

            </FixedNav>

        );
    }

}
