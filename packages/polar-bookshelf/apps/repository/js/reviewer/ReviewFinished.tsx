import * as React from 'react';
import {CheckedSVGIcon} from "../../../../web/js/ui/svg_icons/CheckedSVGIcon";
import {SVGIcon} from "../../../../web/js/ui/svg_icons/SVGIcon";
import Button from '@material-ui/core/Button';

interface ReviewLayoutProps {
    readonly onClose?: () => void;
    readonly children: JSX.Element;
}

const ReviewLayout = (props: ReviewLayoutProps) => {

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
                        onClick={props.onClose}>
                    CONTINUE
                </Button>

            </div>

        </div>

    );
};

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

interface ReviewFinishedProps {
    readonly onClose?: () => void;
}

export const ReviewFinished = (props: ReviewFinishedProps) => (

    <ReviewLayout onClose={props.onClose}>

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

