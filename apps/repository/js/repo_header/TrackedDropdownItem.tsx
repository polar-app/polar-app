import * as React from 'react';
import {SimpleTooltip} from '../../../../web/js/ui/tooltip/SimpleTooltip';
import {DropdownItem} from 'reactstrap';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {FontAwesomeIcon} from "../../../../web/js/ui/fontawesome/FontAwesomeIcon";
import {Analytics} from "../../../../web/js/analytics/Analytics";

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
                          hidden={Optional.of(this.props.hidden).getOrElse(false)}
                          onClick={() => this.onClick()}>

                <div style={{
                    display: 'flex'
                }}>

                    <div className="text-muted"
                         style={{
                             width: '22px',
                             display: 'flex'
                         }}>


                        <div className="m-auto">
                            <FontAwesomeIcon name={this.props.icon}/>
                        </div>

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

        if (this.props.trackingCategory) {
            Analytics.event({category: this.props.trackingCategory, action});
        }

        this.props.onClick();

    }

}

export interface TrackedDropdownItemProps {

    readonly id: string;
    readonly title: string;
    readonly tooltip: string;
    readonly icon?: string;
    readonly hidden?: boolean;
    readonly className?: string;

    readonly trackingCategory?: string;
    readonly onClick: () => void;

}

interface IState {

}
