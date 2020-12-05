import * as React from 'react';
import {NoteBullet} from "../../../web/js/notes/ NoteBullet";
import {ArrowDown} from "../../../web/js/notes/ArrowDown";
import {ArrowRight} from "../../../web/js/notes/ArrowRight";
import {NoteButton} from "../../../web/js/notes/NoteButton";

export const NotesComponentsStory = () => {
    return (
        <div style={{flexGrow: 1}}>
            <div>

                <h3>NoteBullet</h3>

                <NoteBullet target='asdf'/>

                <h3>ArrowDown</h3>

                <ArrowDown/>

                <h3>ArrowRight</h3>

                <ArrowRight/>


                <h3>NoteButton /w ArrowRight</h3>

                <NoteButton>
                    <ArrowRight/>
                </NoteButton>
            </div>

        </div>
    )
}