import * as React from 'react';
import Moment from 'react-moment';
import {DocAnnotation} from '../DocAnnotation';
import {CommentDropdown} from './CommentDropdown';
import {FlashcardDropdown} from './FlashcardDropdown';
import {Logger} from '../../logger/Logger';
import {IStyleMap} from '../../react/IStyleMap';

const log = Logger.create();

const Styles: IStyleMap = {

    barBody: {
        display: 'flex'
    },

    barChild: {
        marginTop: 'auto',
        marginBottom: 'auto',
    }

};

/**
 * A generic wrapper that determines which sub-component to render.
 */
export class FlashcardComponent extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onDelete = this.onDelete.bind(this);
        this.state = {};

    }

    public render() {
        const { flashcard } = this.props;

        const key = 'comment-' + flashcard.id;

        const RenderFrontAndBackFields = () => {

            return (
                <div>

                    <div className="pb-1 pt-1">

                            <span dangerouslySetInnerHTML={{__html: flashcard.fields!.front}}>

                            </span>

                    </div>

                    <div className="pb-1 pt-1 border-top">

                            <span dangerouslySetInnerHTML={{__html: flashcard.fields!.back}}>

                            </span>

                    </div>

                </div>
            );

        };

        const RenderClozeFields = () => {

            return (
                <div>
                    <div className="pb-1 pt-1">
                        <span dangerouslySetInnerHTML={{__html: flashcard.fields!.text}}>
                        </span>
                    </div>
                </div>
            );

        };

        const RenderFields = () => {

            if (flashcard.fields!.text) {
                return (<RenderClozeFields/>);
            } else {
                return (<RenderFrontAndBackFields/>);
            }

        };

        return (

            <div key={key}>

                <div className="flashcard card shadow-sm mb-3">

                    <div className="card-body p-1">

                        <RenderFields/>

                    </div>

                </div>

                <div style={Styles.barBody}
                     className="flexbar comment-bar border-top pt-1">

                    <div style={Styles.barChild} className="text-muted">
                        {/*TODO: make this into its own component... */}
                        <Moment withTitle={true} titleFormat="D MMM YYYY hh:MM A" fromNow>
                            {flashcard.created}
                        </Moment>
                    </div>

                    <div style={Styles.barChild} className="flexbar-right">
                        <FlashcardDropdown id={'flashcard-dropdown-' + flashcard.id}
                                           flashcard={flashcard}
                                           onDelete={() => this.onDelete(flashcard)}/>
                    </div>

                </div>

            </div>
        );
    }

    private onDelete(flashcard: DocAnnotation) {
        log.info("Flashcard deleted: ", flashcard);
        delete flashcard.pageMeta.flashcards[flashcard.id];
    }


}
interface IProps {
    flashcard: DocAnnotation;
}

interface IState {

}


