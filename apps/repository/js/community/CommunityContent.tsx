import * as React from 'react';
import {Logger} from '../../../../web/js/logger/Logger';
import {RepoSidebar} from '../RepoSidebar';
import {MessageBanner} from '../MessageBanner';
import {WhatsNewContent} from '../splash/splashes/whats_new/WhatsNewContent';
import {Card, CardBody, CardTitle, CardText, CardHeader} from 'reactstrap';
import CardSubtitle from 'reactstrap/lib/CardSubtitle';
import DonationsCard from './DonationsCard';
import GithubStarsCard from './GithubStarsCard';
import MailingListCard from "./MailingListCard";

const log = Logger.create();

export default class CommunityContent extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        return (

            <div>

                <div className="container-fluid">

                    <div className="row">

                        <div className="col-lg-6">
                            <DonationsCard/>
                        </div>

                        <div className="col-lg-6">
                            <GithubStarsCard/>
                        </div>

                    </div>

                </div>

                <div className="container-fluid">

                    <div className="row">

                        <div className="col-lg-6">
                            <MailingListCard/>
                        </div>



                    </div>

                </div>


                {/*<div className="buttons">*/}

                    {/*<div className="button">*/}
                        {/*<a href="https://discord.gg/GT8MhA6">*/}
                            {/*<img src="https://img.shields.io/discord/477560964334747668.svg?logo=discord"/>*/}
                        {/*</a>*/}
                    {/*</div>*/}

                    {/*<div className="button">*/}
                        {/*<a href="https://github.com/burtonator/polar-bookshelf/releases">*/}
                            {/*<img src="https://img.shields.io/github/downloads/burtonator/polar-bookshelf/total.svg"/>*/}
                        {/*</a>*/}
                    {/*</div>*/}

                    {/*<div className="button">*/}
                        {/*<a href="https://github.com/burtonator/polar-bookshelf">*/}
                            {/*<img src="https://img.shields.io/github/stars/burtonator/polar-bookshelf.svg?style=social&label=Star"/>*/}
                        {/*</a>*/}
                    {/*</div>*/}

                    {/*<div className="button">*/}
                        {/*<a href="https://twitter.com/getpolarized?ref_src=twsrc%5Etfw">*/}
                            {/*<img src="https://img.shields.io/twitter/follow/getpolarized.svg?style=social&label=Follow"/>*/}
                        {/*</a>*/}
                    {/*</div>*/}

                {/*</div>*/}

            </div>

        );
    }

}

export interface IProps {

}

export interface IState {

}
