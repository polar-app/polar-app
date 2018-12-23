import * as React from 'react';
import {ListGroupItem} from 'reactstrap';

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

            <ListGroupItem active={active}
                           tag="a"
                           href={this.props.href}
                           onClick={() => this.props.onClick()}
                           action>

                <i className={this.props.iconClassName}></i>
                &nbsp; {this.props.text}

            </ListGroupItem>

        );

    }

}

interface IProps {
    readonly href: string;
    readonly iconClassName: string;
    readonly text: string;
    readonly onClick: () => void;
}

interface IState {
}
