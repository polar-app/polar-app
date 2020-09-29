import React from 'react';

interface IProps {
    readonly children: React.ReactElement;
}

/**
 * Root components that are specific just to the Repository.
 */
export const RepositoryRoot = React.memo((props: IProps) => {
    return props.children;
});
