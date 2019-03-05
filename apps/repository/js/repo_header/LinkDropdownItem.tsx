import * as React from 'react';
import {SimpleTooltip} from '../../../../web/js/ui/tooltip/SimpleTooltip';
import {DropdownItem} from 'reactstrap';
import {Nav} from '../../../../web/js/ui/util/Nav';
import {RendererAnalytics} from '../../../../web/js/ga/RendererAnalytics';

/**
 */
export class LinkDropdownItem extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (
            <DropdownItem id={this.props.id}
                          size="sm"
                          onClick={() => this.onClick()}>

                <div style={{
                    display: 'flex'
                }}>

                    <div style={{
                        width: '22px',
                        display: 'flex'
                    }}>

                        <i className={this.props.icon}
                           style={{
                               fontSize: '20px',
                               margin: 'auto',
                           }}></i>

                    </div>

                    &nbsp; {this.props.title}

                </div>


                <SimpleTooltip target={this.props.id}
                               show={0}
                               placement="left">

                    {this.props.tooltip}

                </SimpleTooltip>

            </DropdownItem>
        );

    }

    private onClick() {

        const action = this.props.title.replace(/ /g, '').toLowerCase();
        RendererAnalytics.event({category: 'links-dropdown-click', action});

        Nav.openLinkWithNewTab(this.props.link);

    }

}

interface IProps {
    readonly id: string;
    readonly link: string;
    readonly title: string;
    readonly tooltip: string;
    readonly icon: string;
}

interface IState {

}
