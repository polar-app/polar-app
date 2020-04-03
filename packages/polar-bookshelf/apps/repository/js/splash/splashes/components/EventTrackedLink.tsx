import React from 'react';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {Analytics} from "../../../../../../web/js/analytics/Analytics";

/**
 * A simple button that also supports sending an event when clicked.
 */
export class EventTrackedLink extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
    }

    public render() {

        const className
            = Optional.of(this.props.className)
            .getOrElse("btn btn-success btn-lg");

        return (

            <a className={className}
               href={this.props.href}
               onClick={() => this.onClick()}
               role="button">

                {this.props.children}

            </a>

        );
    }

    private onClick() {

        Analytics.event({category: this.props.eventCategory, action: this.props.eventAction});

    }

}

interface IProps {
    readonly href: string;
    readonly className?: string;
    readonly eventCategory: string;
    readonly eventAction: string;
}

interface IState {
}

