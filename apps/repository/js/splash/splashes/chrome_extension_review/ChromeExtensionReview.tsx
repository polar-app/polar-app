/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Splash} from '../../Splash';
import {EmbeddedImages} from '../whats_new/EmbeddedImages';
import {SplitLayout, SplitLayoutLeft, SplitLayoutRight} from '../../../../../../web/js/ui/split_layout/SplitLayout';
import {CallToActionLink} from '../components/CallToActionLink';
import {EventTrackedLink} from '../components/EventTrackedLink';

const LINK = 'https://chrome.google.com/webstore/detail/save-to-polar/jkfdkjomocoaljglgddnmhcbolldcafd/';

export class ChromeExtensionReview extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (

            <Splash settingKey={this.props.settingKey}>

                <SplitLayout>

                    <SplitLayoutLeft>

                        <h2>Rate our Chrome Extension?</h2>

                        <p className="h5">
                            How do you like Polar?  Could you take <b>1 minute</b> to
                            rate our Chrome extension?
                        </p>

                        <p className="h5">
                            These ratings greatly help other users discover Polar.
                        </p>

                        <p className="h5">
                            Just click the link below and then select <i>Reviews</i> then click <i>Write a Review</i>.
                        </p>

                        <p className="text-center mt-4">
                            <a className="btn btn-success btn-lg" href={LINK} role="button">Rate Chrome Extension</a>
                        </p>

                    </SplitLayoutLeft>

                    <SplitLayoutRight>

                        <p className="text-center m-2">

                            <EventTrackedLink className=""
                                              eventCategory='splash-chrome-extension-review'
                                              eventAction='clicked'
                                              href={LINK}>

                                <img style={{maxHeight: '250px'}} src={EmbeddedImages.CHROME_LOGO}/>

                            </EventTrackedLink>

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

