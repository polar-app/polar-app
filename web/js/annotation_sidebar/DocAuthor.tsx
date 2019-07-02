import * as React from 'react';
import {Author} from "../metadata/Author";
import {Logger} from "../logger/Logger";
import {NullCollapse} from "../ui/null_collapse/NullCollapse";

const log = Logger.create();

/**
 * A generic wrapper that determines which sub-component to render.
 */
export class DocAuthor extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {
        const {author} = this.props;

        return (

            <div className="mt-auto mb-auto mr-1">

                <img src={author!.image!.src}
                     alt={author!.name!}
                     title={author!.name!}
                     className="rounded"
                     style={{
                         maxWidth: '18px',
                         maxHeight: '18px'
                     }}/>

            </div>
        );

    }

}
interface IProps {
    readonly author?: Author;
}

interface IState {

}


