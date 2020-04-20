import {BaseProps, IProps, MUITagInputControl} from './MUITagInputControl';
import {Tag} from "polar-shared/src/tags/Tags";
import {
    InjectedComponent,
    ReactInjector
} from "../../../web/js/ui/util/ReactInjector";
import * as React from "react";

export namespace MUITagInputControls {

    interface Opts extends BaseProps {
        readonly onDone: (tags: ReadonlyArray<Tag>) => void;
    }

    const TagInputDialog = (props: Opts) => {

        let tags = props.existingTags ? props.existingTags() : [];

        return (
            <MUITagInputControl {...props}
                                onChange={_tags => tags = _tags}
                                onDone={() => props.onDone(tags)}/>
        );

    };

    /**
     * Prompt for tags, then handle the given function.
     */
    export function prompt(opts: Opts) {

        // FIXME: this is not injecting under the root and break themes..

        let injected: InjectedComponent | undefined;

        const cleanup = () => {
            injected!.destroy();
        };

        const onCancel = () => {
            cleanup();
            opts.onCancel();
        };

        const onDone = (tags: ReadonlyArray<Tag>) => {
            cleanup();
            opts.onDone(tags);
        };

        injected = ReactInjector.inject(<TagInputDialog {...opts}
                                                         onCancel={onCancel}
                                                         onDone={onDone}/>);

    }

}
