import Button from '@material-ui/core/Button';
import * as React from 'react';
import {useAIFlashcardVerificationWarning} from "../../repository/js/ui/AIFlashcardVerifiedAction";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {MUIDialogController} from "../../../web/js/mui/dialogs/MUIDialogController";

const Inner = () => {

    const triggerWarning = useAIFlashcardVerificationWarning();

    return (
        <Button variant="contained" onClick={() => triggerWarning({onAccept: NULL_FUNCTION})}>
            Trigger AI Flashcard Account Verification
        </Button>
    );

}

export const AccountVerificationStory = () => {

    return (
        <div>
            <MUIDialogController>
                <Inner/>
            </MUIDialogController>
        </div>
    );
}