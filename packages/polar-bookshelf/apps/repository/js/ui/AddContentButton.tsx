import * as React from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import {AddContentFab} from "./AddContentFab";
import {useHistory} from 'react-router-dom';
import {MUITooltip} from "../../../../web/js/mui/MUITooltip";

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

    interface IProps {
        readonly style?: React.CSSProperties;
    }

    export const Desktop = React.memo(function Desktop(props: IProps) {

        const doAdd = useAddFileDropzone();

        return (
            // <MUITooltip title="Upload and add PDFs and EPUBs to your repository">
                <Button id="add-content-dropdown"
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon/>}
                        onClick={doAdd}
                        style={{
                            ...props.style
                        }}
                        size="large">
                    Add Document
                </Button>
            // </MUITooltip>
        );
    });

}
