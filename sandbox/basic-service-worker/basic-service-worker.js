if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('my-service-worker.js');
    console.log("Service worker registered!.");

    console.log("Loading example.org");

    setTimeout(init, 2500);


} else {
    console.error("Service workers not supported.");
}


function init() {
    console.log("init...");

    document.querySelector("iframe").src = 'http://www.example.org';

    document.querySelector("img").src = 'https://cdn.cnn.com/cnnnext/dam/assets/180622150555-mysteryveteran-01-medium-tease.jpg';

    console.log("init...done");


}
