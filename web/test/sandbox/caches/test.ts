
async function doTest() {
    const cache = await caches.open('my-cache');

    const url = './test.txt';

    // const stream = new ReadableStream({
    //     start(controller) {
    //         if (/* there's more data */) {
    //             controller.enqueue(/* your data here */);
    //         } else {
    //             controller.close();
    //         }
    //     });
    // });
    //
    // var response = new Response(stream, {
    //     headers: {'content-type': 'text/html'}
    // });

    // await cache.put(url, response);

}

