const spacings = [1, 2, 3];

function createStyle(className, cssProp, value) {
    console.log(`.${className} { ${cssProp}: ${value} }`);

}

function createStyleProp(key, prop) {

    for (const spacing of spacings) {

        const pixels = spacing * 5;
        createStyle(`${key}-${spacing}`, `${prop}`, `${pixels}px`);
        createStyle(`${key}t-${spacing}`, `${prop}-top`, `${pixels}px`);
        createStyle(`${key}b-${spacing}`, `${prop}-bottom`, `${pixels}px`);
        createStyle(`${key}l-${spacing}`, `${prop}-left`, `${pixels}px`);
        createStyle(`${key}r-${spacing}`, `${prop}-right`, `${pixels}px`);

        if (prop === 'margin') {
            createStyle(`${key}-auto`, `${prop}`, `auto`);
            createStyle(`${key}l-auto`, `${prop}-left`, `auto`);
            createStyle(`${key}r-auto`, `${prop}-right`, `auto`);
            createStyle(`${key}t-auto`, `${prop}-top`, `auto`);
            createStyle(`${key}b-auto`, `${prop}-bottom`, `auto`);
        }

    }

}

createStyleProp('m', 'margin');
createStyleProp('p', 'padding');

