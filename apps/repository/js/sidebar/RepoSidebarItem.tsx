import * as React from 'react';
import ListGroupItem from 'reactstrap/lib/ListGroupItem';
import {SimpleTooltipEx} from '../../../../web/js/ui/tooltip/SimpleTooltipEx';
import {Link} from "react-router-dom";

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
                <Link
                    to={{
                        pathname: "/",
                        hash: "#overview",
                    }}
                    onClick={() => this.props.onClick()}
                >

                    asdf
                </Link>

                {/*<a id="sidebar-item-stats" href="#stats"*/}
                {/*   className="list-group-item-action list-group-item">*/}
                {/*    <div style="display: flex;">*/}
                {/*        <div style="width: 1em; text-align: right;"><i*/}
                {/*            className="fas fa-chart-line"></i></div>*/}
                {/*        <div*/}
                {/*            style="padding-left: 10px; font-weight: normal;">Statistics*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</a>*/}


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
    readonly href: string;
    readonly iconClassName: string;
    readonly text: string;
    readonly onClick: () => void;
    readonly tooltip?: string;
}

interface IState {
}
