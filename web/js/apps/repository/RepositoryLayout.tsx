import React from 'react';
import {RepoHeader3} from "../../../../apps/repository/js/repo_header/RepoHeader3";
import {RepoFooter} from "../../../../apps/repository/js/repo_footer/RepoFooter";
import isEqual from 'react-fast-compare';

interface IProps {
    readonly children: JSX.Element;
}

export const RepositoryLayout = React.memo((props: IProps) => {

    return (
        <>
            <RepoHeader3 />

            {/*<SyncBar key="sync-bar" progress={app.syncBarProgress}/>*/}

            {props.children}

            <RepoFooter/>
        </>
    );

}, isEqual)
