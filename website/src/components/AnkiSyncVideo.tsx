import * as React from "react";

interface IProps {
    readonly className?: string;
}

export const AnkiSyncVideo = (props: IProps) => {
    return (
        <video className={props.className}
               autoPlay={true}
               loop={true}
               muted={true}
               poster="/anki-sync.png">
            <source src="/anki-sync.mp4" type="video/mp4"/>
        </video>
    );

}
