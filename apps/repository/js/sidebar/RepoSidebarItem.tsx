import * as React from 'react';
import ListGroupItem from 'reactstrap/lib/ListGroupItem';
import {SimpleTooltip} from '../../../../web/js/ui/tooltip/SimpleTooltip';
import {SimpleTooltipEx} from '../../../../web/js/ui/tooltip/SimpleTooltipEx';

/**
 * Simple header for the repository which supports arbitrary children.
 */
export class RepoSidebarItem extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        const hash = document.location!.hash !== '' ? document.location!.hash : "#";

        const active = hash === this.props.href;

        return (

            <SimpleTooltipEx text={this.props.tooltip || ""}
                             show={0}
                             placement="right">

                <ListGroupItem {...(this.props.id ? {id: this.props.id} : {})}
                               active={active}
                               tag="a"
                               href={this.props.href}
                               onClick={() => this.props.onClick()}
                               action>

                    {/*<div style={{position: 'absolute', top: '0px', left: '55px'}>*/}
                    {/*<i className={this.props.iconClassName}></i>*/}
                    {/*</div>*/}

                    <div style={{display: 'flex'}}>

                        <div style={{width: '1em', textAlign: 'right'}}>
                            <i className={this.props.iconClassName}></i>
                        </div>

                        <div style={{paddingLeft: '10px', fontWeight: 'normal'}}>
                            {this.props.text}
                        </div>

                    </div>

                </ListGroupItem>

            </SimpleTooltipEx>

        );

    }

}

interface IProps {
    readonly id?: string;
    readonly href: string;
    readonly iconClassName: string;
    readonly text: string;
    readonly onClick: () => void;
    readonly tooltip?: string;
}

interface IState {
}
