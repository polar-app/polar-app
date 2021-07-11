import React from 'react';
import path from 'path';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { Strings } from 'polar-shared/src/util/Strings';
import { HelloServerSideRender } from 'polar-bookshelf/web/js/ssr/HelloServerSideRender';
import { Files } from 'polar-shared/src/util/Files';

// TODO:
//
// how do we determine, from an HTTP request, if there is a current user.

// we need to use a __session HTTP param and

// https://firebase.google.com/docs/hosting/manage-cache
//
// When present, the __session cookie is automatically made a part of the cache
// key, meaning that it's impossible for two users with different cookies to
// receive the other's cached response. Only use the __session cookie if your
// app serves different content depending on user authorization.

// https://firebase.google.com/docs/hosting/manage-cache
// https://firebase.google.com/docs/auth/admin/manage-cookies
export namespace SSR {

    /**
     * Render the React Component using React-Dom
     * @returns String
     */
    export function renderComponent(): string {
        return renderToString(<HelloServerSideRender />);
    }

    /**
     * Read the File and return the content
     */
    export async function readIndexHTML(): Promise<string> {

        const resolvedPackagePath = require.resolve('polar-bookshelf/package.json');
        const resolvedPackageDir = path.dirname(resolvedPackagePath);

        const directory = resolvedPackageDir + '/dist/public/index.html';

        const buff = await Files.readFileAsync(directory);
        return buff.toString('utf-8');

    }

    /**
     * Inject the rendered component into the HTML document
     */
    export async function render(): Promise<string> {

        const file = await readIndexHTML();
        const rendered = renderComponent();

        const setssr = file.replace(
            '<meta name="ssr" content="false" />',
            '<meta name="ssr" content="true" />'
        );

        return Strings.replaceUsingMarkers(
            setssr,
            rendered,
            '<!-- SSR: root start -->',
            '<!-- SSR: root end -->'
        );

    }

}
