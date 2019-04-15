import * as React from 'react';
import {ToggleButton} from '../../js/ui/ToggleButton';
import {NULL_FUNCTION} from '../../js/util/Functions';
import {LeftRightSplit} from '../../js/ui/left_right_split/LeftRightSplit';
import {UncontrolledDropdown} from 'reactstrap';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import Button from 'reactstrap/lib/Button';
import Progress from 'reactstrap/lib/Progress';

export class FundraisingCampaign extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <div>

                <div className="mb-1 rounded border p-2 text-justify"
                     style={{backgroundColor: '#F3CF32', fontWeight: 'bold'}}>

                        {/*<i className="fas fa-info-circle" style={{color: 'blue', backgroundColor: 'white'}}></i>*/}
                         <b>Dear Polar Users</b>! Polar needs your help to remain
                        Open Source.
                        We're launching a crowdfunding campaign to keep Polar
                        Open Source and continue funding development for the
                        next six months.

                        Our core user base is large enough that we should be
                        able to raise enough money to continue funding Polar
                        development.

                    <div className="text-center p-2">

                        <span className="text-muted">Raised</span> <span className="text-primary">$2,425</span> <span className="text-muted">of</span> <span className="text-primary">$25,000</span>

                    </div>

                    <div className="">

                        <div className="ml-auto mr-auto" style={{maxWidth: '20em'}}>

                            {/*/!*<div className="mt-auto mr-auto">*!/*/}

                                {/*/!*<span className="text-xl text-primary">*!/*/}
                                    {/*/!*55%*!/*/}
                                {/*/!*</span>*!/*/}

                            {/*/!*</div>*!/*/}

                            <div className="m-auto">
                                <Progress value={55}/>
                            </div>

                        </div>

                    </div>

                    <div className="text-center p-2">

                        <Button color="secondary"
                                size="md"
                                style={{fontWeight: 'bold'}}>More Info</Button>

                        <Button className="ml-2"
                                color="success"
                                size="md"
                                style={{fontWeight: 'bold'}}>Donate Now</Button>

                    </div>

                    <div className="mb-2">

                        <div className="m-auto border border-secondary"
                             style={{
                                 width: '450px',
                                 height: '450px',
                                 backgroundColor: 'lightgrey'
                             }}>
                            video
                        </div>

                    </div>


                </div>


                <div className="mb-2">

                    <progress className="w-100" value={0.5}/>

                </div>

                <div>

                    <LeftRightSplit
                        left={<div>
                            I'm donated directly.
                        </div>}
                        right={<ToggleButton label="" onChange={NULL_FUNCTION}/>}/>

                    <LeftRightSplit className="mt-1"
                        left={<div>
                            <b>I'm a monthly subscriber.</b>

                            <p>
                                Monthly subscribers... blah blah blah.
                            </p>
                        </div>}
                        right={
                            <UncontrolledDropdown size="sm">
                                <DropdownToggle caret>
                                    Select
                                </DropdownToggle>
                                <DropdownMenu right className="shadow">
                                    <DropdownItem>I'm a monthly subscriber</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>

                        }/>


                </div>

            </div>
        );

    }

}


interface IProps {
}

interface IState {

    readonly progress: number;

}


