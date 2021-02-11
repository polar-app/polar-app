import * as React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

export const MUILoading = React.memo(() => (
    <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        overflow: 'hidden'
    }}>

        <CircularProgress style={{
            margin: 'auto',
            width: '75px',
            height: '75px',
        }}/>

    </div>
));
