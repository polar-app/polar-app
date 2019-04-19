import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import {Nav} from '../util/Nav';
import Progress from 'reactstrap/lib/Progress';
import {CrowdfundingProgress} from './CrowdfundingProgress';

export class CrowdfundingBar extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {


        return (

            <div className="mt-1 mb-1 rounded p-2"
                 style={{backgroundColor: '#F3CF32', fontWeight: 'bold'}}>

                {/*<Progress value={55} className="w-100"/>*/}

                <div style={{display: 'flex'}}>

                    <div className="mt-auto mb-auto">
                        {/*Polar needs your help to remain Open Source.  Please help fund our crowdfunding campaign.*/}

                        Please help Polar remain Open Source by donating to our crowdfunding campaign.

                    </div>

                    <div className="mt-auto mb-auto" style={{flexGrow: 1}}>

                        {/*<table>*/}
                            {/*<td>*/}
                                {/*<progress value={0.5}*/}
                                          {/*style={{color: 'blue', width: '100%'}}></progress>*/}
                            {/*</td>*/}
                        {/*</table>*/}
                        <CrowdfundingProgress/>

                    </div>

                    <div className="mt-auto mb-auto"
                         style={{
                             justifyContent: 'flex-end',
                         }}>

                        <Button color="secondary"
                                size="sm"
                                onClick={() => Nav.openLinkWithNewTab("https://getpolarized.io/2019/04/11/Polar-Initial-Crowdfunding-Campaign.html")}
                                style={{fontWeight: 'bold'}}>More Info</Button>

                        <Button className="ml-2"
                                color="success"
                                size="sm"
                                onClick={() => Nav.openLinkWithNewTab("https://opencollective.com/polar-bookshelf")}
                                style={{fontWeight: 'bold'}}>Donate Now</Button>


                    </div>


                </div>

            </div>


        );

    }

}


interface IProps {
}

interface IState {
}


