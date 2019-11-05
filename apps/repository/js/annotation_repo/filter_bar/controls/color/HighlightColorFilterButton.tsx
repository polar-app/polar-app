import * as React from 'react';
import {Button, Popover, PopoverBody} from 'reactstrap';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {IDs} from "../../../../../../../web/js/util/IDs";
import {ColorSelectorBox, ColorStr} from "../../../../../../../web/js/ui/colors/ColorSelectorBox";
import {DropdownChevron} from "../../../../../../../web/js/ui/util/DropdownChevron";
import {Buttons} from "../Buttons";

export class HighlightColorFilterButton extends React.PureComponent<IProps, IState> {

    private id: string;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.deactivate = this.deactivate.bind(this);
        this.activate = this.activate.bind(this);
        this.onSelected = this.onSelected.bind(this);

        this.state = {
            open: false
        };

        this.id = IDs.create('highlight-color-filter-button');

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

        const {id, props} = this;
        const {selected} = props;

        const onSelected = props.onSelected || NULL_FUNCTION;

        const active = selected !== undefined && selected.length > 0;
        const buttonProps = Buttons.activeProps(active);

        return (

            <div className={this.props.className || ''}
                 style={this.props.style}>

                <Button color={buttonProps.color}
                        outline={buttonProps.outline}
                        id={id}
                        size="sm"
                        style={{
                            whiteSpace: 'nowrap'
                        }}
                        onClick={() => this.activate()}>

                    <i className="fas fa-swatchbook"/> <span className="d-none-mobile">Colors</span> <DropdownChevron/>

                </Button>

                <Popover placement="bottom"
                         trigger="legacy"
                         fade={false}
                         delay={0}
                         isOpen={this.state.open}
                         toggle={() => this.deactivate()}
                         target={id}>

                    <PopoverBody className="shadow rounded p-2"
                                 style={{backgroundColor: '#ffffff'}}>

                        {/*FIXME: reset button and multi-colors*/}

                        <ColorSelectorBox selected={this.props.selected}
                                          onSelected={(color) => this.onSelected(color)}/>

                    </PopoverBody>

                </Popover>

            </div>
        );

    }

    private onSelected(color: ColorStr) {

        const onSelected = this.props.onSelected || NULL_FUNCTION;

        this.deactivate();

        const selected = this.props.selected || [];

        const newSelected = selected.includes(color) ?
            selected.filter(current => current != color) :
            [...selected, color];

        onSelected(newSelected);

    }

}

interface IProps {

    readonly className?: string;

    readonly style?: React.CSSProperties;

    readonly size?: string;

    readonly onSelected?: (selected: ReadonlyArray<ColorStr>) => void;

    readonly selected?: ReadonlyArray<ColorStr>;

}

interface IState {
    readonly open: boolean;
}
