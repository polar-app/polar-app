import {DocMetas} from "../../../web/js/metadata/DocMetas";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import * as React from "react";
import {MUIPaperToolbar} from "../../../web/spectron0/material-ui/MUIPaperToolbar";

interface IProps {
    readonly docMeta: IDocMeta;
}

export const PagemarkProgressBar = (props: IProps) => {

    const perc = DocMetas.computeProgress(props.docMeta);

    return (
        <MUIPaperToolbar borderBottom>

            <div style={{
                     display: 'flex',
                     alignItems: "center"
                 }}
                 className="p-1">

                <progress value={perc}
                          className="mt-auto mb-auto"
                          style={{flexGrow: 1}}/>
            </div>

        </MUIPaperToolbar>
    );

};
