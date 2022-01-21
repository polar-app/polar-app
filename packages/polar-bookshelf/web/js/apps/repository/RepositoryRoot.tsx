import React from 'react';

interface IProps {
    readonly children: React.ReactElement;
}

/**
 * Root components that are specific just to the Repository.
 *
 * @deprecated This doesn't do anything and isn't needed anymore I think.
 */
export const RepositoryRoot = React.memo(function RepositoryRoot(props: IProps) {
    return (
        <>
            {props.children}
        </>
    );

});
