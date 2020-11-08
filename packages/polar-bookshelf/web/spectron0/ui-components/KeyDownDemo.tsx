import * as React from 'react';

export const KeyDownDemo = () => (
    <div onKeyDown={() => console.log("got key down")}>
        <input type="text"/>
    </div>
);
