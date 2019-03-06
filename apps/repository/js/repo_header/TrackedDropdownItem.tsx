import * as React from 'react';
import {SimpleTooltip} from '../../../../web/js/ui/tooltip/SimpleTooltip';
import {DropdownItem} from 'reactstrap';
import {Nav} from '../../../../web/js/ui/util/Nav';
import {RendererAnalytics} from '../../../../web/js/ga/RendererAnalytics';

/**
 */
export class TrackedDropdownItem extends React.PureComponent<TrackedDropdownItemProps, IState> {

    constructor(props: TrackedDropdownItemProps, context: any) {
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

                        <i className={this.props.icon + ' text-muted'}
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
        RendererAnalytics.event({category: this.props.trackingCategory, action});

        Nav.openLinkWithNewTab(this.props.link);

    }

}

export interface GenericDropdownItemProps {
    readonly id: string;
    readonly link: string;
    readonly title: string;
    readonly tooltip: string;
    readonly icon: string;
    readonly hidden?: boolean;
}

export interface TrackedDropdownItemProps extends GenericDropdownItemProps {
    readonly trackingCategory: string;
}

interface IState {

}
