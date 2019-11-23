import * as React from 'react';
import {ReleaseMetadatas} from "polar-release-metadata/src/ReleaseMetadatas";
import {Arrays} from "polar-shared/src/util/Arrays";

const releases = ReleaseMetadatas.get();

export class WhatsNewContent extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const release = Arrays.first(releases);

        if (! release) {
            // should almost never happen
            return null;
        }

        const VideoEmbed = () => {

            if (release.video_embed) {

                return <div className="embed-responsive embed-responsive-16by9 mt-1 mb-1">

                    <iframe className="embed-responsive-item"
                            width="560"
                            height="315"
                            src={release.video_embed}
                            frameBorder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen/>
                </div>;

            }

            return null;

        };

        return (

            <div>

                <VideoEmbed/>

                <h1>
                    {release.title}
                </h1>

                <div className="text-sm"
                     dangerouslySetInnerHTML={{__html: release.html}}>

                </div>

            </div>
        );

    }

}

interface IProps {
}

interface IState {
}
