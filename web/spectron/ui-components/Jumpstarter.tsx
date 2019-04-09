import * as React from 'react';
import {ToggleButton} from '../../js/ui/ToggleButton';
import {NULL_FUNCTION} from '../../js/util/Functions';
import {LeftRightSplit} from '../../js/ui/left_right_split/LeftRightSplit';
import Input from 'reactstrap/lib/Input';

export class Jumpstarter extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <div>

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
                        right={ <Input type="select" bsSize="sm">
                            <option>Small Select</option>
                            <option>Small Select</option>
                        </Input>}/>


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


