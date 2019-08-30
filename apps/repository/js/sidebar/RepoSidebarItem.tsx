import * as React from 'react';
import ListGroupItem from 'reactstrap/lib/ListGroupItem';
import {SimpleTooltipEx} from '../../../../web/js/ui/tooltip/SimpleTooltipEx';
import {Link} from "react-router-dom";
import {ReactRouterLinks} from "../../../../web/js/ui/ReactRouterLinks";

/**
 * Simple header for the repository which supports arbitrary children.
 */
export class RepoSidebarItem extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        const active = ReactRouterLinks.isActive(this.props.target);

        return (

            <SimpleTooltipEx text={this.props.tooltip || ""}
                             show={0}
                             placement="right">

                <Link id="sidebar-item-stats"
                      to={this.props.target}
                      onClick={() => this.props.onClick()}
                      className="list-group-item-action list-group-item">

                        <div style={{display: 'flex'}}>

                            <div style={{width: '1em', textAlign: 'right'}}>
                                <i className={this.props.iconClassName}/>
                            </div>

                            <div style={{paddingLeft: '10px', fontWeight: 'normal'}}>
                                {this.props.text}
                            </div>

                        </div>

                </Link>


                {/*<a {...(this.props.id ? {id: this.props.id} : {})}*/}
                {/*   active={active}*/}
                {/*   tag="a"*/}
                {/*   href={this.props.href}*/}
                {/*   onClick={() => this.props.onClick()}*/}
                {/*   className="list-group-item-action list-group-item">*/}

                {/*    <div style={{display: 'flex'}}>*/}

                {/*        <div style={{width: '1em', textAlign: 'right'}}>*/}
                {/*            <i className={this.props.iconClassName}/>*/}
                {/*        </div>*/}

                {/*        <div style={{paddingLeft: '10px', fontWeight: 'normal'}}>*/}
                {/*            {this.props.text}*/}
                {/*        </div>*/}

                {/*    </div>*/}

                {/*</a>*/}

            </SimpleTooltipEx>

        );

    }

}

interface IProps {
    readonly id?: string;
    readonly target: Target;
    readonly iconClassName: string;
    readonly text: string;
    readonly onClick: () => void;
    readonly tooltip?: string;
}

interface IState {
}

export interface Target {
    readonly pathname: string;
    readonly hash?: string;
}
