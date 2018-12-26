import * as React from 'react';
import {Logger} from '../../../../web/js/logger/Logger';
import {Card, CardBody, CardHeader, CardText} from 'reactstrap';
import {EmbeddedImages} from '../splash/splashes/whats_new/EmbeddedImages';

const log = Logger.create();

export default class SurveyCard extends React.Component<any, any> {

    constructor(props: any, context: any) {
        super(props, context);

    }

    public render() {

        return (

            <Card>
                <CardHeader><b>Take our Survey</b></CardHeader>
                <CardBody>
                    <CardText>

                        <div className="mt-2 mb-2 intro">

                            <p className="text-center">

                            <a href="https://kevinburton1.typeform.com/to/u1zNWG">
                            <img src={EmbeddedImages.SURVEY}></img>
                            </a>

                            </p>

                            <p>
                            Could you take 2 minutes and <a href="https://kevinburton1.typeform.com/to/u1zNWG">answer 10 questions
                            </a> about
                            your use of Polar?  We're trying to focus on the most
                            important features for our user base and your feedback
                            is critical!
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
