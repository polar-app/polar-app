import * as React from 'react';
import {PopoverBody} from 'reactstrap';
import {Popover} from 'reactstrap';
import {NULL_FUNCTION} from '../../util/Functions';
import {ColorButton} from './ColorButton';
import {RGBColor} from './ColorButton';
import {ColorSelectorBox} from './ColorSelectorBox';

export class ColorSelector extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.deactivate = this.deactivate.bind(this);

        this.state = {
            open: false
        };

    }

    private deactivate() {

        this.setState({
            open: false
        });
    }

    private activate() {

        this.setState({
            open: true
        });

    }

    public render() {

        const props = this.props;

        const onSelected = props.onSelected || NULL_FUNCTION;

        return (

            <div>

                <ColorButton color={this.props.color}
                             size={this.props.size}
                             id="ColorButton1"
                             onSelected={() => this.activate()}/>

                <Popover placement="bottom"
                         trigger="legacy"
                         delay={0}
                         isOpen={this.state.open}
                         target="ColorButton1"
                         toggle={this.deactivate}>

                    <PopoverBody className="shadow rounded p-2"
                                 style={{backgroundColor: '#ffffff'}}>

                        <ColorSelectorBox onSelected={(color) => {
                                              this.deactivate();
                                              onSelected(color);
                                          }}/>

                    </PopoverBody>

                </Popover>

            </div>
        );

    }

}

interface IProps {

    readonly size?: string;

    /**
     * The current color
     */
    readonly color: RGBColor;

    readonly onSelected?: (color: string) => void;

}

interface IState {
    readonly open: boolean;
}
