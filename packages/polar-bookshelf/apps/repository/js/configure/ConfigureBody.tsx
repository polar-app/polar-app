import * as React from "react";

export const ConfigureBody = (props: any) => (
    <div className="container-fluid" style={{width: '600px'}}>

        <div className="row">
            <div className="col">
                {props.children}
            </div>
        </div>

    </div>
);

