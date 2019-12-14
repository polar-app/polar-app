import * as React from 'react';
import {BottomSheet} from "./BottomSheet";
import {ActionButtonWithText} from "./ActionButtonWithText";
import {Callback} from "polar-shared/src/util/Functions";

export class StartReviewBottomSheet extends React.Component<IProps> {

    public render() {

       return <BottomSheet>

            <div style={{display: 'flex', flexDirection: 'column'}}>

                <div className="ml-auto mr-auto mb-1 pt-3">
                    <b>Start Review</b>
                </div>

                <div style={{display: 'flex'}} className="pb-3">

                    <div className="ml-auto mr-auto">

                        <ActionButtonWithText icon="fas fa-book-reader"
                                              text="Reading"
                                              onClick={() => this.props.onReading()}/>

                    </div>

                    <div className="ml-auto mr-auto">

                        <ActionButtonWithText icon="fas fa-bolt"
                                              text="Flashcards"
                                              onClick={() => this.props.onFlashcards()}/>

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
