import React from 'react';
import {StoryHolder} from "../StoryHolder";
import {NoteFormatBar} from "../../../web/js/notes/NoteFormatBar";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export const NoteFormatBarStory = () => {
    return (
        <StoryHolder>
            <NoteFormatBar mode="format" setMode={NULL_FUNCTION}/>
        </StoryHolder>
    )
}
