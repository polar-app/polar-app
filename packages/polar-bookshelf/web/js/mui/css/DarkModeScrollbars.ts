export namespace DarkModeScrollbars {

    export function createCSSForReact() {
        return {

            '*::-webkit-scrollbar': {
                width: '12px'
            },
            '*::-webkit-scrollbar-track': {
                // '-webkit-box-shadow': 'inset 0 0 5px rgba(255, 255, 255, 0.3'
                backgroundColor: 'rgb(73, 73, 73)'

            },
            '*::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgb(111, 111, 111)',
                borderRadius: '10px',
                border: 'solid 2px rgb(73, 73, 73)'

            },
        };
    }

    export function createCSS() {
        return {

            '*::-webkit-scrollbar': {
                width: '12px'
            },
            '*::-webkit-scrollbar-track': {
                // '-webkit-box-shadow': 'inset 0 0 5px rgba(255, 255, 255, 0.3'
                'background-color': 'rgb(73, 73, 73)'

            },
            '*::-webkit-scrollbar-thumb': {
                'background-color': 'rgb(111, 111, 111)',
                'border-radius': '10px',
                'border': 'solid 2px rgb(73, 73, 73)'

            },
        };
    }

}
