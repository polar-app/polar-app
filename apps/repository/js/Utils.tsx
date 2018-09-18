import React from "react";

function range(len: number) {
    const arr = [];
    for (let i = 0; i < len; i++) {
        arr.push(i);
    }
    return arr;
}

const newPerson = () => {
    const statusChance = Math.random();
    return {
        title: 'Mastering Bitcoin',
        progress: Math.floor(Math.random() * 100),
    };
};

export function makeData(len = 5553): any {
    return range(len).map(d => {
        return {
            ...newPerson(),
            children: range(10).map(newPerson)
        };
    });
}

export const Logo = () =>
    <div style={{ margin: '1rem auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center'}}>
</div>;

export const Tips = () =>
    <div style={{ textAlign: "center" }}>
    <em>Tip: Hold shift when sorting to multi-sort!</em>
    </div>;

export const Footer = () =>
    <footer style={{ textAlign: "center" }}>
    {/*Like Polar?  Show your love by giving us a Github star!*/}

    <div className="buttons">

        <div className="button">
            <a className="github-button" href="https://github.com/burtonator/polar-bookshelf" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star burtonator/polar-bookshelf on GitHub">Star</a>
        </div>

        <div className="button">
            <a href="https://twitter.com/getpolarized?ref_src=twsrc%5Etfw" className="twitter-follow-button" data-show-count="false">Follow @getpolarized</a>
        </div>
    </div>
    </footer>;
