import React from 'react';

export const App = () => {

    const [element, setElement] = React.useState<HTMLElement | null>(null);

    console.log('render')

    return (
        <div ref={(ref) => {
            console.log('got ref');
            setElement(ref);
        }}>
            test
        </div>
    );

}
