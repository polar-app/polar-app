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
    <div>
        <Resizable top={0}
                   left={0}
                   width={100}
                   height={100}
                   color="rgb(255, 0, 0)"/>
    </div>
);
