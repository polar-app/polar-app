import * as React from 'react';
import {BottomSheet} from "./BottomSheet";
import {ActionButtonWithText} from "./ActionButtonWithText";
import {Callback} from "polar-shared/src/util/Functions";
import {Link} from "react-router-dom";

export class StartReviewBottomSheet extends React.Component<IProps> {

    public render() {

       return <BottomSheet>

            <div style={{display: 'flex', flexDirection: 'column'}}>

                <div className="ml-auto mr-auto mb-1 pt-4 text-grey700">
                    <b>Start Review</b>
                </div>

                <div style={{
                        display: 'flex',
                        maxWidth: '50em',
                        minWidth: '20em'
                     }}
                     className="pb-4 ml-auto mr-auto">

                    <div className="ml-auto mr-auto">

                        <Link to={{pathname: '/annotations', hash: '#review-reading'}}>
                            <ActionButtonWithText icon="fas fa-book-reader"
                                                  text="Reading"
                                                  onClick={() => this.props.onReading()}/>
                        </Link>

                    </div>

                    <div className="ml-auto mr-auto">

                        <Link to={{pathname: '/annotations', hash: '#review-flashcards'}}>
                            <ActionButtonWithText icon="fas fa-bolt"
                                                  text="Flashcards"
                                                  onClick={() => this.props.onFlashcards()}/>
                        </Link>

                    </div>

                </div>

            </div>

        </BottomSheet>;

    }

}

export interface IProps {
    readonly onReading: Callback;
    readonly onFlashcards: Callback;
}
