import * as React from "react";

export const PreviewWarning = () => {

    return (
        <div className="text-danger text-sm">
            <p style={{fontSize: '1em'}}>
                <b>Preview: </b> This is currently a preview feature and not yet ready for general use.
                {/*Abandon hope all ye who enter here.*/}
            </p>
        </div>
    );

};
