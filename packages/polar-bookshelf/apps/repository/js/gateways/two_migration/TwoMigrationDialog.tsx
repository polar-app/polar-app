import * as React from 'react';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { TwoMigrationContent } from './TwoMigrationContent';
import {MUIGapBox} from "../../../../../web/js/mui/MUIGapBox";
import {useLinkLoader} from "../../../../../web/js/ui/util/LinkLoaderHook";

interface IProps {
    readonly onClose: () => void;
}

export const TwoMigrationDialog = React.memo(function TwoMigrationDialog(props: IProps) {

    const [open, setOpen] = React.useState(true);

    const linkLoader = useLinkLoader();

    const handleLink = React.useCallback(() => {
        const link = "https://getpolarized.io/2020/10/05/Polar-2-0-Release.html";
        linkLoader(link, {newWindow: true, focus: true});
    }, [linkLoader]);

    function handleClose() {
        setOpen(false);
        props.onClose();
    }

    return (

        <Dialog maxWidth='md'
                open={open}
                onClose={handleClose}>

            <DialogContent>
                <TwoMigrationContent/>
            </DialogContent>

            <DialogActions style={{justifyContent: 'center'}}>

                <MUIGapBox>

                    <Button variant="contained"
                            size="large"
                            onClick={handleLink}>
                        Read More
                    </Button>

                    <Button color="primary"
                            variant="contained"
                            size="large"
                            onClick={handleClose}>
                        Let's Go!
                    </Button>

                </MUIGapBox>

            </DialogActions>

        </Dialog>

    );

});
