import * as React from 'react';
import {Button} from "reactstrap";
import {CheckedSVGIcon} from "../../../../web/js/ui/svg_icons/CheckedSVGIcon";
import {SVGIcon} from "../../../../web/js/ui/svg_icons/SVGIcon";
import {Link} from "react-router-dom";

export class ReviewFinished extends React.Component<IProps> {

    public render() {

        return (
            <div style={{
                     display: 'flex',
                     flexDirection: 'column',
                     flexGrow: 1,
                 }}>

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

                <div className="text-center m-2">

                    <Link to={{pathname: '/annotations'}}>
                        <Button color="primary" size="lg">
                            CONTINUE
                        </Button>
                    </Link>

                </div>

            </div>
        );
    }

}

interface IProps {

}
