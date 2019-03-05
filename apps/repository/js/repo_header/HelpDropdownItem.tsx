import * as React from 'react';
import {SimpleTooltip} from '../../../../web/js/ui/tooltip/SimpleTooltip';
import {DropdownItem} from 'reactstrap';
import {Nav} from '../../../../web/js/ui/util/Nav';
import {RendererAnalytics} from '../../../../web/js/ga/RendererAnalytics';
import {TrackedDropdownItem, GenericDropdownItemProps} from './TrackedDropdownItem';

/**
 */
export class HelpDropdownItem extends React.PureComponent<GenericDropdownItemProps, IState> {

    constructor(props: GenericDropdownItemProps, context: any) {
        super(props, context);
    }

    public render() {

        return (
            <TrackedDropdownItem trackingCategory='help-dropdown-click'
                                 id={this.props.id}
                                 link={this.props.link}
                                 title={this.props.title}
                                 tooltip={this.props.tooltip}
                                 icon={this.props.icon}/>
        );

    }

}

interface IState {

}
