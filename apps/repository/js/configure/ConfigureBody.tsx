import * as React from "react";

export const ConfigureBody = (props: any) => (
    <div className="container-fluid" style={{maxWidth: '600px'}}>

        <div className="row">
            <div className="col">
                {props.children}
            </div>
        </div>

    </div>
);

