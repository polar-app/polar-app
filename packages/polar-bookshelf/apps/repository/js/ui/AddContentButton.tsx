import * as React from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import {AddContentFab} from "./AddContentFab";
import {useHistory} from 'react-router-dom';

export namespace AddContent {

    function useAddFileDropzone() {

        const history = useHistory();

        return () => {
            history.push({hash: "#add"});
        }

    }

    export const Handheld = () => {

        const doAdd = useAddFileDropzone();

        return (
            <AddContentFab onClick={() => doAdd()}/>
        );

    };

    export const Desktop = () => {

        const doAdd = useAddFileDropzone();

        return (
            <Button id="add-content-dropdown"
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon/>}
                    onClick={doAdd}
                    style={{
                        minWidth: '285px'
                    }}
                    size="large">
                Add Document
            </Button>
        );
    };

}
