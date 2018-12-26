import * as React from 'react';
import {Logger} from '../../../../web/js/logger/Logger';
import {RepoSidebar} from '../RepoSidebar';
import {MessageBanner} from '../MessageBanner';
import {WhatsNewContent} from '../splash/splashes/whats_new/WhatsNewContent';
import {Card, CardBody, CardTitle, CardText, CardHeader} from 'reactstrap';
import CardSubtitle from 'reactstrap/lib/CardSubtitle';

const log = Logger.create();

export default class GithubStarsCard extends React.Component<any, any> {

    constructor(props: any, context: any) {
        super(props, context);

    }

    public render() {

        return (

            <Card>
                <CardHeader><b>Github Stars</b></CardHeader>
                <CardBody>
                    <CardText>

                        <div className="mt-2 mb-2 intro">

                            <p>
                                Liking Polar?  Would you mind giving us a star on
                                Github?
                            </p>

                            <p className="text-center">
                                <a href="https://github.com/burtonator/polar-bookshelf">
                                    <img height="100"
                                         src="https://img.shields.io/github/stars/burtonator/polar-bookshelf.svg?style=social&label=Star"/>
                                </a>
                            </p>

                        </div>

                    </CardText>
                </CardBody>
            </Card>

        );
    }

}

export interface IProps {

}

export interface IState {

}
