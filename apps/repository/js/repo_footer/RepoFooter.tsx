import * as React from 'react';
import {BottomNavButton} from "./BottomNavButton";
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";

/**
 * Simple header for the repository which supports arbitrary children.
 */
export class RepoFooter extends React.PureComponent<IProps> {

    public render() {

        const Delegate =
            <footer className="border-top text-lg"
                    style={{
                        width: '100%',
                        backgroundColor: 'var(--primary-background-color)',
                    }}>

                <div className=""
                     style={{
                         display: 'flex'
                     }}>

                    <BottomNavButton pathname="/annotations" icon="fas fa-home" replace={true}/>
                    <BottomNavButton pathname="/stats" icon="fas fa-chart-line" replace={true}/>
                    <BottomNavButton pathname="/settings" icon="fas fa-cog" replace={true}/>

                </div>

            </footer>;

        return (

            <DeviceRouter phone={Delegate} tablet={Delegate}/>

        );

    }

}

interface IProps {
}
