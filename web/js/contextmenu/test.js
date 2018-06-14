// element = document.querySelector(".page");
//
// element.addEventListener("contextmenu", function (event) {


document.querySelectorAll(".text-highlight").forEach(function(element) {

    console.log("Registering contextmenu on", element);

    element.addEventListener("contextmenu", function (event) {

        console.log("GOT contextmenu");

    });


    element.addEventListener("click", function (event) {

        console.log("GOT click");

    });

});

document.querySelectorAll(".textLayer").forEach(function(element) {

    console.log("Registering contextmenu on", element);

    element.addEventListener("contextmenu", function (event) {

        console.log("GOT contextmenu");

    });


    element.addEventListener("click", function (event) {

        console.log("GOT click");

    });

});
