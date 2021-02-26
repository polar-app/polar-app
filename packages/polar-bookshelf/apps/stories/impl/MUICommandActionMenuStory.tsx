import React from "react";
import {useCommandActionMenu} from "../../../web/js/mui/command_action/UseCommandActionMenu";

export const MUICommandActionMenuStory = () => {

    const divRef = React.useRef<HTMLDivElement | null>(null);

    const [onKeyDown] = useCommandActionMenu({
        trigger: '[['
    });

    return (
        <div style={{
                 display: 'flex',
                 flexDirection: 'column',
                 flexGrow: 1
             }}>

            <div ref={divRef}
                 contentEditable={true}
                 spellCheck={false}
                 onKeyUp={event => onKeyDown(event, divRef.current)}
                 style={{
                     outline: 'none',
                 }}
                 dangerouslySetInnerHTML={{__html: "this is the content"}}/>

        </div>
    );

}
