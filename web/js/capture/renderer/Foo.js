class Foo {

}

// preload.js
const _Foo = Foo
process.once('loaded', () => {
    console.log("Re-defining... ", Foo);
    console.log("Re-defining... ", _Foo);
    global.Foo = Foo;
});

console.log("Loaded foo!", Foo);
