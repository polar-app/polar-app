import * as React from 'react';
import {CheckedSVGIcon} from "../../../../web/js/ui/svg_icons/CheckedSVGIcon";
import {SVGIcon} from "../../../../web/js/ui/svg_icons/SVGIcon";
import {useHistory} from "react-router-dom";
import Button from '@material-ui/core/Button';
import { useReviewerCallbacks } from './ReviewerStore';

const ReviewLayout = (props: any) => {

    const history = useHistory();
    const {onReset} = useReviewerCallbacks();

    const onContinue = React.useCallback(() => {
        onReset();
        history.replace({pathname: '/annotations', hash: ""});
    }, [history, onReset]);

    return (

        <div style={{
                 display: 'flex',
                 flexDirection: 'column',
                 flexGrow: 1,
             }}>

            <div className="text-center m-2"
                 style={{flexGrow: 1}}>

                {props.children}

            </div>

            <div className="text-center m-2">

                <Button variant="contained"
                        color="primary"
                        size="large"
                        onClick={onContinue}>
                    CONTINUE
                </Button>

            </div>

        </div>

    );
};

export const CloudSyncRequired = () => (

    <ReviewLayout>
        <div className="text-center p-5">

            <h2>Cloud sync required (please login)</h2>

            <div className="p-3">
                <i className="fas fa-cloud-upload-alt text-danger" style={{fontSize: '125px'}}/>
            </div>

            <h3 className="text-muted">
                Cloud sync is required to review annotations.  Please login to review flashcards and reading.
            </h3>

        </div>
    </ReviewLayout>

);

export const NoTasks = () => (
    <ReviewLayout>
        <div className="text-center p-5">

            <h2>No tasks to complete</h2>

            <div className="p-3">
                <i className="far fa-check-circle text-primary" style={{fontSize: '125px'}}/>
            </div>

            <h3 className="text-muted">
                Try creating some flashcards and let's try this again.
            </h3>

        </div>
    </ReviewLayout>
);

export const ReviewFinished = () => (
    <ReviewLayout>

        <div className="text-center m-2"
             style={{flexGrow: 1}}>

            <div className="m-2">
                <SVGIcon size={200}>
                    <CheckedSVGIcon/>
                </SVGIcon>
            </div>

            <h2>Review Completed!</h2>

            <p className="text-muted text-xl">
                Nice.  Every time you review you're getting smarter and a step closer to your goal.  Great work!
            </p>

        </div>

    </ReviewLayout>
);
