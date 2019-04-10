import * as React from 'react';
import {ToggleButton} from '../../js/ui/ToggleButton';
import {NULL_FUNCTION} from '../../js/util/Functions';
import {LeftRightSplit} from '../../js/ui/left_right_split/LeftRightSplit';
import {UncontrolledDropdown} from 'reactstrap';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownItem from 'reactstrap/lib/DropdownItem';

export class FundraisingCampaign extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <div>

                <div className="mb-2">

                    <div className="m-auto"
                         style={{
                             width: '450px',
                             height: '450px',
                             backgroundColor: 'lightgrey'
                         }}>
                        video
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


