import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {App} from './App';
import {PDFThumbnailer} from "polar-pdf/src/pdf/PDFThumbnailer";

async function doAsync() {
    await PDFThumbnailer.generate('./example.pdf')
}

doAsync().catch(err => console.error(err));
