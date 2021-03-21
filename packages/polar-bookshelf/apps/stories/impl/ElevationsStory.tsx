import * as React from 'react';
import {MUIElevation, Elevation, useElevationBackground} from "../../../web/js/mui/MUIElevation";

interface ElevationExampleProps {
    readonly elevation: Elevation;
}

const ElevationExample = (props: ElevationExampleProps) => {

    const backgroundElevation = useElevationBackground(props.elevation)

    return (
        <>
            <MUIElevation style={{
                              margin: '15px',
                              padding: '10px'
                          }}
                          elevation={props.elevation}>
                <div>
                    {props.elevation} default: {backgroundElevation.default}
                </div>
            </MUIElevation>
            <MUIElevation style={{
                              margin: '15px',
                              padding: '10px'
                          }}
                          elevation={props.elevation}
                          highlighted={true}>
                <div>
                    {props.elevation} highlighted: {backgroundElevation.highlighted}
                </div>
            </MUIElevation>
        </>
    )

}

const elevations: ReadonlyArray<Elevation> = [0, 1, 2];

const ElevationsList = () => {
    return (
        <div style={{
                display: 'flex',
                flexGrow: 1,
                flexDirection: 'column'
             }}>

            {elevations.map(current => (
                <ElevationExample key={current} elevation={current}/>
                ))}

        </div>

    );
}


export const ElevationsStory = () => {

    return (
        <ElevationsList/>
    )

}
