import * as React from 'react';

const DocView = () => (
    <div style={{
            display: 'flex',
            flexGrow: 1,
            overflow: 'auto'
         }}>

        {/*TODO: the main book content should be rendered here...*/}

    </div>
);

export const Reader = () => {

    return (
        <div style={{
                height: '100%',
                width: '100%',
                padding: 0,
                margin: 0
             }}>

            <DocView/>

        </div>
    );
};

