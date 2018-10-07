import * as React from 'react';
import Moment from 'react-moment';
import {DocAnnotation} from '../DocAnnotation';

/**
 * A generic wrapper that determines which sub-component to render.
 */
export class FlashcardComponent extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {};

    }

    public render() {
        const { flashcard } = this.props;

        const key = 'comment-' + flashcard.id;

        return (

            <div className="card">

                <div key={key} className="card-body p-1">

                    <div className="pb-1 pt-1">

                        <span dangerouslySetInnerHTML={{__html: flashcard.fields!.front}}>

                        </span>

                    </div>

                    <hr/>

                    <div className="pb-1 pt-1">

                        <span dangerouslySetInnerHTML={{__html: flashcard.fields!.back}}>

                        </span>

                    </div>

                    <div className="flexbar comment-bar border-top pt-1">

                        <div className="text-muted">
                            {/*TODO: make this into its own component... */}
                            <Moment withTitle={true} titleFormat="D MMM YYYY hh:MM A" fromNow>
                                {flashcard.created}
                            </Moment>
                        </div>

                        <div className="flexbar-right">


                        </div>

                    </div>


                </div>

            </div>
        );
    }

}
interface IProps {
    flashcard: DocAnnotation;
}

interface IState {

}


