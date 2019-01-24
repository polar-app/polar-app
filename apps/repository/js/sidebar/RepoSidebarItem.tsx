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

        );

    }

}

interface IProps {
    readonly id?: string;
    readonly href: string;
    readonly iconClassName: string;
    readonly text: string;
    readonly onClick: () => void;
}

interface IState {
}
