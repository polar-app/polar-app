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

        if (release) {
            return (

                <div>
                    <div className="text-sm"
                         dangerouslySetInnerHTML={{__html: release.html}}>

                    </div>
                </div>
            );

        } else {
            // should almost never happen
            return null;
        }

    }

}

interface IProps {
}

interface IState {
}
