import React from 'react';
import path from 'path';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { Strings } from 'polar-shared/src/util/Strings';
import { HelloServerSideRender } from 'polar-bookshelf/web/js/ssr/HelloServerSideRender';
import { Files } from 'polar-shared/src/util/Files';


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

        const file = await readIndexFile();
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
