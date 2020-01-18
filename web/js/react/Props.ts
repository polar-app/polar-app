
import * as React from 'react';

export interface MutableStandardProps {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
}

export interface StandardProps extends Readonly<MutableStandardProps> {

}

export class Props {

    public static create(props: StandardProps): StandardProps {

        const result: MutableStandardProps = {};

        if (props.id) {
            result.id = props.id;
        }

        if (props.className) {
            result.className = props.className;
        }

        if (props.style) {
            result.style = props.style;
        }

        return result;

    }

    /**
     * Merge standard props like id, className, style such that we don't have any
     * that are undefined after the merge.
     */
    public static merge(a: StandardProps, b: StandardProps): StandardProps {

        const result: MutableStandardProps = {

        };

        if (a.id !== undefined || b.id !== undefined) {
            // use the first ID
            result.id = a.id ?? b.id;
        }

        if (a.className !== undefined || b.className !== undefined) {

            if (a.className && b.className) {
                result.className = a.className + ' ' + b.className;
            }

            result.className = a.className ?? b.className;

        }

        if (a.style !== undefined || b.style !== undefined) {

            result.style = {
                ...(a.style ?? {}),
                ...(b.style ?? {})
            };

        }

        return result;
    }

}
