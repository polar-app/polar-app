import React from 'react';
import {EPUBContextMenuRoot} from '../doc/src/renderers/epub/contextmenu/EPUBContextMenuRoot';

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
        <IFrameContent/>
        <EPUBContextMenuRoot/>
    </div>
);
