import * as React from 'react';
import {BottomNavButton} from "./BottomNavButton";
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";
import {Devices} from "../../../../web/js/util/Devices";

export const RepoFooter = () => {

    const style: React.CSSProperties = {
        width: '100%',
        backgroundColor: 'var(--primary-background-color)',
    };

    if (Devices.get() === 'tablet') {
        // TODO: maybe do this via CSS
        style.paddingTop = '0.5em';
        style.paddingBottom = '0.5em';
    }

    const Delegate =
        <footer className="border-top text-lg"
                style={style}>

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

};
