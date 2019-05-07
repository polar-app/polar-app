import * as React from 'react';
import {Button} from 'reactstrap';
import {PopoverBody} from 'reactstrap';
import {Popover} from 'reactstrap';
import {HighlightColor} from '../../js/metadata/BaseHighlight';
import {UncontrolledButtonDropdown} from 'reactstrap';
import {DropdownToggle} from 'reactstrap';
import {DropdownMenu} from 'reactstrap';
import {DropdownItem} from 'reactstrap';
import {UncontrolledPopover} from 'reactstrap';
import {TwitterPicker} from 'react-color';


interface ColorButtonProps extends IProps {
    readonly color: HighlightColor;
    // readonly onSelected: () =
}

const Spacer = () => {
    return <div style={{width: '10px'}} className="ml-2"/>;
}

const ColorButton = (props: ColorButtonProps) => {

    const createBackgroundColor = () => {

        switch (props.color) {

            case 'yellow':
                return 'rgba(255,255,0)';
            case 'red':
                return 'rgba(255,0,0)';
            case 'green':
                return 'rgba(0,255,0)';
            default:
                throw new Error("Bad color: " + props.color);
        }

    };

    const backgroundColor = createBackgroundColor();

    return <Button size="lg"
            type="button"
            className="border-0 ml-2"
            title=""
            aria-label=""
            color="light"
            // onClick={() => this.dispatchOnHighlighted('yellow')}
            style={{
                backgroundColor,
                width: '30px',
                height: '30px'
            }}>

    </Button>;

};


interface ColorExampleProps {
    readonly color: string;
}

const ColorExample = (props: ColorExampleProps) => {

    return <div style={{
                    margin: '5px'
                }}>


        <div style={{position: 'relative', top: 0}}>

            this is some example text

            <div style={{position: 'absolute',
                         top: 0, backgroundColor: props.color,
                         opacity: 1.0,
                         width: '200px',
                         mixBlendMode: 'multiply',

                         height: '1.4em'}}/>

        </div>

    </div>;

};

const ColorExamples = () => {

    return <div style={{display: 'flex'}}>

        <ColorExample color="#FF6900"/>
        <Spacer/>
        <ColorExample color="#FCB900"/>
        <Spacer/>
        <ColorExample color="#7BDCB5"/>

    </div>;

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

        console.log("FIXME: toggle");

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

                <div style={{}}>
                    this is some example text that would be highlighted
                </div>

                <Button id="Popover2" type="button">
                    Launch Popover
                </Button>

                <ColorExamples/>

                <UncontrolledPopover placement="bottom"
                                     trigger="legacy"
                                     delay={0}
                                     hideArrow
                                     className="border-0"
                                     target="Popover2">

                    <PopoverBody>

                        {/*<ColorButton {...props} color={'yellow'}/>*/}
                        {/*<ColorButton {...props} color={'red'}/>*/}
                        {/*<ColorButton {...props} color={'green'}/>*/}

                        <TwitterPicker triangle='hide'/>

                    </PopoverBody>

                </UncontrolledPopover>



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


