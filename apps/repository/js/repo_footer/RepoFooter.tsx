import * as React from 'react';
import {Link} from "react-router-dom";
import {Button} from "reactstrap";
import {BottomNavButton} from "./BottomNavButton";

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

                    <BottomNavButton pathname="/" hash="#annotations" icon="fas fa-home"/>
                    <BottomNavButton pathname="/" hash="#stats" icon="fas fa-chart-line"/>

                </div>

            </footer>


        );

    }

}

interface IProps {
}
