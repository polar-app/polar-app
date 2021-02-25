import * as React from "react";

// import poster from '../../content/assets/videos/flashcard-review.png';

interface IProps {
    readonly className?: string;
}

export const FlashcardVideo = (props: IProps) => {
    return (
        <video className={props.className}
               autoPlay={true}
               loop={true}
               muted={true}
               poster="/flashcard-review.png">
            <source src="/flashcard-review.mp4" type="video/mp4"/>
        </video>
    );

}
