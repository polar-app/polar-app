import * as React from 'react';
import {Link} from "react-router-dom";
import {ReactRouterLinks, RouterLink} from "../ReactRouterLinks";

export class SimpleTab extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggleHover = this.toggleHover.bind(this);

        this.state = {
            hover: false
        };

    }

    public render() {

        const active = ReactRouterLinks.isActive(this.props.target);

        const computeBorderColor = () => {

            if (active) {
                return 'var(--primary600)';
            }

            if (this.state.hover) {
                return 'var(--grey400)';
            }

            return 'transparent';

        };

        const borderColor = computeBorderColor();

        const borderBottom = `3px solid ${borderColor}`;

        const color = active ? 'var(--grey900)' : 'var(--grey700)';

        return (

            <div id={this.props.id} className="mr-1">

                <Link to={this.props.target}
                      className="p-2"
                      onMouseEnter={() => this.toggleHover()}
                      onMouseLeave={() => this.toggleHover()}
                      style={{
                          color,
                          textDecoration: 'none',
                          borderBottom,
                          userSelect: 'none',
                          whiteSpace: 'nowrap'
                      }}>
                    {this.props.text}
                </Link>

            </div>

        );

    }

    private toggleHover() {
        this.setState({...this.state, hover: ! this.state.hover});
    }

}

export interface IProps {
    readonly id: string;
    readonly target: RouterLink;
    readonly text: string;
}

export interface IState {
    readonly hover: boolean;
}

