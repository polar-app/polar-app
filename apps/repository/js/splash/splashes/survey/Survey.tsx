/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Splash} from '../../Splash';
import {EmbeddedImages} from '../whats_new/EmbeddedImages';
import {SplitLayout, SplitLayoutLeft, SplitLayoutRight} from '../../../../../../web/js/ui/split_layout/SplitLayout';
import {CallToActionLink} from '../CallToActionLink';

const SURVEY_LINK = 'https://kevinburton1.typeform.com/to/u1zNWG';

export class Survey extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (

            <Splash settingKey={this.props.settingKey}>

                <SplitLayout>

                    <SplitLayoutLeft>

                        <h2>How's Polar working for you?</h2>

                        <p className="h5">
                            Could you take <b>2 minutes</b> and <a href={SURVEY_LINK}>answer 10 questions
                        </a> about
                            your use of Polar?
                        </p>

                        <p className="h5">
                            We read <i>every</i> response and your feedback is
                            critical to the success of Polar!
                        </p>

                        <p className="text-center mt-4">


                            <CallToActionLink href={SURVEY_LINK} eventCategory='splash-survey'>
                                Provide Feedback
                            </CallToActionLink>

                        </p>

                    </SplitLayoutLeft>

                    <SplitLayoutRight>

                        <p className="text-center m-2">

                            <i style={{fontSize: '200px'}} className="text-primary fas fa-bullhorn"></i>

                        </p>

                    </SplitLayoutRight>

                </SplitLayout>

            </Splash>

        );
    }

}

interface IProps {
    readonly settingKey: string;
}

interface IState {
}

