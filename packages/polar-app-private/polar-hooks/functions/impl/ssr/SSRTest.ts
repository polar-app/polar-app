import { expect } from 'chai';
import { SSR } from './SSR';

describe('SSR', async function () {
    it('Validate Rendered String Contains Expected Value', async function () {
        const data = SSR.renderComponent();
        expect(data).to.be.a('string').that.contains('Hello server side render!');
    });

    it('Validate File Reading & Value', async function () {
        const data = await SSR.readIndexHTML();
        expect(data).to.be.a('string').that.contains('<!DOCTYPE html>');
    });

    it('Validate File Content Replace Using Strings Helpers', async function () {
        const data = await SSR.render();
        expect(data).to.be.a('string').that.contains('Hello server side render!');
    });
});
