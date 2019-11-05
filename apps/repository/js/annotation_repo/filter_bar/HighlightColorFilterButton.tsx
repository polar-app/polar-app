import * as React from 'react';
import {Button, Popover, PopoverBody} from 'reactstrap';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {IDs} from "../../../../../web/js/util/IDs";
import {ColorSelectorBox} from "../../../../../web/js/ui/colors/ColorSelectorBox";
import {DropdownChevron} from "../../../../../web/js/ui/util/DropdownChevron";

export class HighlightColorFilterButton extends React.PureComponent<IProps, IState> {

    private id: string;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.deactivate = this.deactivate.bind(this);

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

        const onSelected = props.onSelected || NULL_FUNCTION;

        return (

            <div className={this.props.className || ''}
                 style={this.props.style}>

                <Button color="light"
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

    readonly className?: string;

    readonly style?: React.CSSProperties;

    readonly size?: string;

    readonly onSelected?: (color: string) => void;

}

interface IState {
    readonly open: boolean;
}
