import * as React from "react";
import WarningIcon from '@material-ui/icons/Warning';

export const PreviewWarning = () => {

    return (
        <div style={{
                 display: 'flex',
                 alignItems: 'center',
                 fontSize: '1.2em'
             }}>

            <WarningIcon style={{
                             fontSize: '1.4em'
                         }}/>

            <b>Preview: </b> This is currently a preview feature and not yet ready for general use.

            {/*Abandon hope all ye who enter here.*/}
        </div>
    );

};
