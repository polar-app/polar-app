import * as React from 'react';
import {Link} from "react-router-dom";
import {Button} from "reactstrap";

/**
 *
 */
export class BottomNavButton extends React.Component<IProps> {

    public render() {

        const active = document.location.pathname === this.props.pathname;

        const textColorClazz = active ? 'text-primary' : '';

        return (

            <div className="m-auto">
                <Link to={{pathname: this.props.pathname, hash: this.props.hash}}
                      replace={this.props.replace}>
                    <Button size="lg"
                            className="btn-no-outline"
                            color="clear">
                        <span className={textColorClazz}>
                          <i className={this.props.icon}/>
                        </span>
                    </Button>
                </Link>
            </div>

        );

    }

}

interface IProps {
    readonly pathname: string;
    readonly hash?: string;
    readonly replace?: boolean;
    readonly icon: string;
}
