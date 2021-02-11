export namespace UserAgents {

    export function isPrerender() {
        const text = 'Prerender (+https://github.com/prerender/prerender)';
        return navigator.userAgent && navigator.userAgent.indexOf(text) !== -1;
    }

}
