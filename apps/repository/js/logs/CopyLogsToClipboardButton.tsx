import * as React from 'react';
import {Clipboards} from '../../../../web/js/util/system/clipboard/Clipboards';
import Button from "@material-ui/core/Button";
import {ConsoleRecorder} from "polar-shared/src/util/ConsoleRecorder";

export const CopyLogsToClipboardButton = () => {

    const onClick = () => {

        const messages = ConsoleRecorder.snapshot();

        const text = messages.map(current => {

            if (current.params && current.params.length > 0) {
                const args = JSON.stringify(current.params, null, "  ");
                return `${current.created}: ${current.message}: ${args}`;
            } else {
                return `${current.created}: ${current.message}`;
            }

        }).join("\n");

        Clipboards.writeText(text);

        // Toaster.success("Wrote log output to clipboard.");

    }

    return (
        <Button variant="contained"
                onClick={() => onClick()}>
            Copy to Clipboard
        </Button>
    );

}
