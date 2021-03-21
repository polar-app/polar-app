import * as React from "react";

interface IProps {
    readonly className?: string;
}

export const AIFlashcardsVideo = (props: IProps) => {
    return (
        <video className={props.className}
               autoPlay={true}
               loop={true}
               muted={true}
               poster="/ai-flashcards.png">
            <source src="/ai-flashcards.mp4" type="video/mp4"/>
        </video>
    );

}
