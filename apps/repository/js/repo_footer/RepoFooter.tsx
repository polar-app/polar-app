import * as React from 'react';
import {BottomNavButton} from "./BottomNavButton";
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";

/**
 * Simple header for the repository which supports arbitrary children.
 */
export class RepoFooter extends React.PureComponent<IProps> {

    public render() {

        const Delegate =
            <footer className="border-top"
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        zIndex: 1000000,
                        backgroundColor: 'var(--primary-background-color)',
                    }}>

                <div className=""
                     style={{
                         display: 'flex'
                     }}>

                    <BottomNavButton pathname="/annotations" icon="fas fa-home" replace={true}/>
                    <BottomNavButton pathname="/stats" icon="fas fa-chart-line" replace={true}/>

                </div>

            </footer>;

        return (

            <DeviceRouter phone={Delegate} tablet={Delegate}/>

        );

    }

}

interface IProps {
}
