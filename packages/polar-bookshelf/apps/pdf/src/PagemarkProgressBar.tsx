import {DocMetas} from "../../../web/js/metadata/DocMetas";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import * as React from "react";

interface IProps {
    readonly docMeta: IDocMeta;
}

export const PagemarkProgressBar = (props: IProps) => {

    const perc = DocMetas.computeProgress(props.docMeta);

    return (
        <div style={{
                 backgroundColor: 'var(--grey050)',
                 display: 'flex'
             }}
             className="border-bottom p-2">

            <progress value={perc}
                      className=""
                      style={{flexGrow: 1}}/>

        </div>
    );

};
