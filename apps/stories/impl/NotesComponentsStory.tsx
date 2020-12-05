import * as React from 'react';
import {NoteBullet} from "../../../web/js/notes/ NoteBullet";
import {ArrowDown} from "../../../web/js/notes/ArrowDown";
import {ArrowRight} from "../../../web/js/notes/ArrowRight";

export const NotesComponentsStory = () => {
    return (
        <div>

            <h3>NoteBullet</h3>

            <NoteBullet target='asdf'/>

            <h3>ArrowDown</h3>

            <ArrowDown/>

            <h3>ArrowRight</h3>

            <ArrowRight/>

        </div>
    )
}