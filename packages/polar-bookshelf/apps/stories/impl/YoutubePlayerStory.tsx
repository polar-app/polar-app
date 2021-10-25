import * as React from 'react';
import {StoryHolder} from "../StoryHolder";

export const YoutubePlayerStory = () => {
    return (
        <StoryHolder>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/GO5FwsblpT8" frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen></iframe>
        </StoryHolder>
    )
}
