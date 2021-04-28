import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import useTheme from '@material-ui/core/styles/useTheme';
import DialogTitle from '@material-ui/core/DialogTitle';
import Box from '@material-ui/core/Box';

interface IProps {
    readonly children: JSX.Element;
}

interface IState {
    readonly hasError: boolean;
}

export class MUIErrorBoundary extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            hasError: false
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {

        this.setState({hasError: true})

        // You can also log the error to an error reporting service
        console.error("Caught error at React error boundary: ", error, errorInfo.componentStack);

    }

    render() {

        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <MUIInlineErrorDialog>
                    <MUIErrorBoundaryMessage/>
                </MUIInlineErrorDialog>
            );
        }

        return this.props.children;
    }

}

interface MUIErrorBoundaryMessageProps {
}

export const MUIErrorBoundaryMessage = (props: MUIErrorBoundaryMessageProps) => {

    const theme = useTheme();

    return (
        <div>

            <DialogTitle style={{
                             backgroundColor: theme.palette.error.main,
                             color: theme.palette.error.contrastText,
                             padding: theme.spacing(1)
                         }}>

                Houston, We Have a Problem.

            </DialogTitle>

            <Box p={1}>

                <p>
                    We're really sorry but it seems like we hit a snag.
                </p>

                <p>
                    An error occurred and unfortunately it means this page won't
                    load.
                </p>

                <p>
                    The good news is that we've sent this error to the genius
                    programmers that work on Polar and we should have a fix
                    soon!
                </p>

            </Box>

        </div>
    );

}

interface MUIInlineErrorDialogProps {
    readonly children: JSX.Element;
}

export const MUIInlineErrorDialog = React.memo(function MUIInlineErrorDialog(props: MUIInlineErrorDialogProps) {

    const theme = useTheme();

    return (
        <div style={{
                 display: 'flex',
                 width: '100%',
                 height: '100%',
                 position: 'absolute',
                 zIndex: 9999999999,
                 top: 0,
                 left: 0,
                 backgroundColor: theme.palette.background.default
             }}>

            <Paper style={{
                        margin: 'auto',
                        maxWidth: '450px',
                        // maxHeight: '500px',
                        width: '100%',
                        // height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>

                {props.children}

            </Paper>

        </div>
    );
});
