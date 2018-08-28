import React from "react";
//import namor from "namor"

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
        title: 'John',
        //lastName: 'Smith',
        age: Math.floor(Math.random() * 30),
        visits: Math.floor(Math.random() * 100),
        progress: Math.floor(Math.random() * 100),
        status:
            statusChance > 0.66
                ? "relationship"
                : statusChance > 0.33 ? "complicated" : "single"
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
