import * as React from 'react';
import {DocColumnsSelector} from "../../repository/js/doc_repo/DocColumnsSelector";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {StoryHolder} from "../StoryHolder";

export const DocColumnsStory = () => {

    const [columns, setColumns] = React.useState<ReadonlyArray<keyof IDocInfo>>(['title', 'added']);

    return (
        <StoryHolder>
            <>
                <DocColumnsSelector columns={columns} onAccept={setColumns}/>

                <div>
                    {columns.join(', ')}
                </div>
            </>
        </StoryHolder>
    );
};
