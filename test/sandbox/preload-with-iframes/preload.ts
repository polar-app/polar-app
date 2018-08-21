console.log("Preload from " + document.location.href);

document.addEventListener("DOMContentLoaded", function(event){

    let element = document.createElement('div');
    element.innerHTML = `<b>this is the from the preload.</b>`;

    document.body.appendChild(element);
});
