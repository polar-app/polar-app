import * as React from 'react';
import {Link} from "react-router-dom";
import {Button} from "reactstrap";

/**
 * Simple header for the repository which supports arbitrary children.
 */
export class RepoFooter extends React.PureComponent<IProps> {

    public render() {

        return (

            <footer className="d-none-desktop d-none-tablet border-top">

                <div className="mt-1 mb-1"
                     style={{
                         display: 'flex'
                     }}>

                    <div className="m-auto">
                        <Link to={{pathname: "/", hash: "#annotations"}}>
                            <Button size="lg"
                                    color="light">
                                <i className="fas fa-home"/>
                            </Button>
                        </Link>
                    </div>

                    <div className="m-auto">
                        <Link to={{pathname: "/", hash: "#stats"}}>
                            <Button size="lg"
                                    color="light">
                                <i className="fas fa-chart-line"/>
                            </Button>
                        </Link>
                    </div>

                </div>

            </footer>


        );

    }

}

interface IProps {
}
