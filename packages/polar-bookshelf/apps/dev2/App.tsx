import React from 'react';
import {EPUBContextMenuRoot} from '../doc/src/renderers/epub/contextmenu/EPUBContextMenuRoot';
import {Resizable} from "../../web/js/ui/resizable/Resizable";

const IFrameContent = React.memo(() => {

    const content = `    
        <html>
        <body>

        <p>
            first para
        </p>

        <p>
            second para
        </p>

        </body>
        </html>
    `;

    return (
        <div>
            <iframe srcDoc={content}></iframe>
        </div>
    );
});



// sets up finder and context


export const App = () => (
    <div style={{width: '100%'}}>

        <div style={{
                 width: '800px',
                 height: '1000px',
                 marginLeft: 'auto',
                 marginRight: 'auto',
                 backgroundColor: 'orange',
                 position: 'relative'
             }}>

            <Resizable computeInitialPosition={() => {
                           return {
                               top: 0,
                               left: 0,
                               width: 100,
                               height: 100
                           };
                       }}
                       color="rgb(255, 0, 0)"/>


        </div>
    </div>
);
