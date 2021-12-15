import {memoForwardRef} from "../react/ReactUtils";
import * as React from "react";

export const NoAnnotations = memoForwardRef(() => {
    return (
        <div className="p-2"
             style={{
                 display: 'flex',
                 flexDirection: 'column',
                 flexGrow: 1
             }}>

            <div style={{flexGrow: 1}}>

                <h2 className="text-center text-muted text-xxl">
                    No annotation
                </h2>

                <p className="text-muted"
                   style={{fontSize: '16px'}}>

                    Create new annotations by highlighting text in the document
                </p>

            </div>

        </div>
    );
});
