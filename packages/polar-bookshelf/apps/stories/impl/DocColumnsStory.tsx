import * as React from 'react';
import {DocColumnsSelector} from "../../repository/js/doc_repo/DocColumnsSelector";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";

export const DocColumnsStory = () => {

    const [columns, setColumns] = React.useState<ReadonlyArray<keyof IDocInfo>>(['title', 'added']);

    return (
        <div>
            <DocColumnsSelector columns={columns} onAccept={setColumns}/>

            <div>
                {columns.join(', ')}
            </div>

        </div>
    );
};