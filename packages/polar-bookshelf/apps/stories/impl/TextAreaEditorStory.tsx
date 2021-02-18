import React from 'react';
import {TextAreaEditor} from "../../../web/js/notes/textarea/TextAreaEditor";

export const TextAreaEditorStory = () => {

    const [active, setActive] = React.useState(true);
    const [offset, setOffset] = React.useState(0);

    const [content, setContent] = React.useState("hello world")

    return (
        <div style={{
                 display: 'flex',
                 flexGrow: 1,
                 flexDirection: 'column'
             }}>
            <TextAreaEditor onChange={setContent}
                            content={content}
                            active={active}
                            onActivated={() => setActive(true)}
                            offset={offset} />
        </div>
    );

}
