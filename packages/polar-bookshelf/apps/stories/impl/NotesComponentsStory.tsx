import * as React from 'react';
import {BlockBulletButton} from "../../../web/js/notes/BlockBulletButton";
import {ArrowDown} from "../../../web/js/notes/ArrowDown";
import {ArrowRight} from "../../../web/js/notes/ArrowRight";
import {NoteButton} from "../../../web/js/notes/NoteButton";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export const NotesComponentsStory = () => {
    return (
        <div style={{flexGrow: 1}}>
            <div>

                <h3>NoteBullet</h3>

                <BlockBulletButton target='asdf'/>

                <h3>ArrowDown</h3>

                <ArrowDown/>

                <h3>ArrowRight</h3>

                <ArrowRight/>


                <h3>NoteButton /w ArrowRight</h3>

                <NoteButton onClick={NULL_FUNCTION}>
                    <ArrowRight/>
                </NoteButton>
            </div>

        </div>
    )
}
