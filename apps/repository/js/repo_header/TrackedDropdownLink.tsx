import * as React from 'react';
import {Nav} from '../../../../web/js/ui/util/Nav';
import {TrackedDropdownItem} from './TrackedDropdownItem';
import {URLs} from "polar-shared/src/util/URLs";
import {Link} from "react-router-dom";

/**
 * Tracked dropdown item that just loads a link.
 */
export class TrackedDropdownLink extends React.PureComponent<TrackedDropdownLinkProps, IState> {

    constructor(props: TrackedDropdownLinkProps, context: any) {
        super(props, context);
    }

    public render() {

        const DropdownItem = () => (

            <TrackedDropdownItem id={this.props.id}
                                 title={this.props.title}
                                 trackingCategory={this.props.trackingCategory}
                                 icon={this.props.icon}
                                 tooltip={this.props.tooltip}
                                 hidden={this.props.hidden}
                                 onClick={() => this.onClick()}/>

        );

        if (URLs.isWebScheme(this.props.link)) {
            return <DropdownItem/>;
        } else {
            return (
                <Link to={this.props.link} className='no-underline'>
                    <DropdownItem/>
                </Link>
            );
        }

    }

    private onClick() {

        if (URLs.isWebScheme(this.props.link)) {
            Nav.openLinkWithNewTab(this.props.link);
        }

    }

}
export interface TrackedDropdownLinkProps {

    readonly id: string;
    readonly title: string;
    readonly tooltip: string;
    readonly icon: string;
    readonly hidden?: boolean;

    readonly trackingCategory: string;
    readonly link: string;

}

interface IState {

}
