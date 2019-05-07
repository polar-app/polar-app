import * as React from 'react';
import {Button} from 'reactstrap';
import {PopoverBody} from 'reactstrap';
import {Popover} from 'reactstrap';
import {HighlightColor} from '../../js/metadata/BaseHighlight';
import {UncontrolledButtonDropdown} from 'reactstrap';
import {DropdownToggle} from 'reactstrap';
import {DropdownMenu} from 'reactstrap';
import {DropdownItem} from 'reactstrap';

interface ColorButtonProps extends IProps {
    readonly color: HighlightColor;
    // readonly onSelected: () =
}

const ColorButton = (props: ColorButtonProps) => {

    const createBackgroundColor = () => {

        switch (props.color) {

            case 'yellow':
                return 'rgba(255,255,0)';
            case 'red':
                return 'rgba(255,0,0)';
            case 'green':
                return 'rgba(0,255,0)'
            default:
                throw new Error("Bad color: " + props.color);
        }

    };

    const backgroundColor = createBackgroundColor();

    return <Button size="lg"
            type="button"
            className="border ml-1 mr-1"
            title=""
            aria-label=""
            color="light"
            // onClick={() => this.dispatchOnHighlighted('yellow')}
            style={{
                backgroundColor,
                width: '1.5em',
                height: '1.5em'
            }}>

    </Button>;

};

export class ColorDropdown extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);

        this.state = {
            open: false
        };

    }
    private toggle() {

        this.setState({
            open: !this.state.open
        });
    }

    public render() {

        const props = this.props;

        return (
            <div>
                <Button id="Popover1" type="button">
                    Launch Popover
                </Button>

                <Popover placement="bottom"
                         isOpen={this.state.open}
                         target="Popover1"
                         toggle={this.toggle}>

                    <PopoverBody>

                        <ColorButton {...props} color={'yellow'}/>
                        <ColorButton {...props} color={'red'}/>
                        <ColorButton {...props} color={'green'}/>

                    </PopoverBody>

                </Popover>

                <UncontrolledButtonDropdown>

                    <DropdownToggle caret>
                        D
                    </DropdownToggle>
                    <DropdownMenu>

                        <DropdownItem  tag="div" className="m-0 p-0 w-0">x</DropdownItem>

                    </DropdownMenu>
                </UncontrolledButtonDropdown>

            </div>
        );
    }

}

interface IProps {
    readonly onSelected: (color: HighlightColor) => void;
}

interface IState {
    readonly open: boolean;
}


