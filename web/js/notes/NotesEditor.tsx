import React from "react";
import {CKEditor5} from "../../../apps/stories/impl/ckeditor5/CKEditor5";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {IActionMenuItem, NoteActionMenu2} from "./NoteActionMenu2";
import {useComponentDidMount} from "../hooks/ReactLifecycleHooks";

interface IProps {
    readonly content: string;
}

const items: ReadonlyArray<IActionMenuItem> = [
    {
        id: 'today',
        text: 'Today'
    },
    {
        id: 'tomorrow',
        text: 'Tomorrow'
    },

]

export const NoteEditor = React.memo((props: IProps) => {

    return (
        <NoteActionMenu2 items={() => items} onItem={item => console.log('got item: ', item)}>
            <CKEditor5 content={props.content} onChange={NULL_FUNCTION}/>
        </NoteActionMenu2>
    );

});
