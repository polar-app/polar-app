import * as React from 'react';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {CKEditor5BalloonEditor} from './ckeditor5/CKEditor5BalloonEditor';
import {CKEditor5GlobalCss} from "./ckeditor5/CKEditor5GlobalCss";
import BalloonEditor from "@ckeditor/ckeditor5-build-balloon";
import { Numbers } from 'polar-shared/src/util/Numbers';

console.log(BalloonEditor.builtinPlugins.map((plugin: any) => plugin.pluginName ));


export const CKEditor5Story2 = () => {

    return (
        <div>
            <CKEditor5GlobalCss/>

            {Numbers.range(1, 100).map(idx => (
                <CKEditor5BalloonEditor key={idx}
                                        content={`${idx} this is the <b>content</b> there are many like it but this one is mine.`}
                                        preEscaped={true}
                                        onChange={NULL_FUNCTION}
                                        onEditor={NULL_FUNCTION}/>
            )}

        </div>
    )
}