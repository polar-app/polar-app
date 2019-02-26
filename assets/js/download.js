// TODO: determine the latest version by calling the github API and finding
// the latest release and then updating the .js file accordingly.

function configureDownloads() {

    const downloads = {

        "download-win-64": `https://github.com/burtonator/polar-bookshelf/releases/download/v${polar_release}/polar-bookshelf-${polar_release}-x64.exe`,
        "download-win-32": `https://github.com/burtonator/polar-bookshelf/releases/download/v${polar_release}/polar-bookshelf-${polar_release}-ia32.exe`,
        "download-macos-dmg": `https://github.com/burtonator/polar-bookshelf/releases/download/v${polar_release}/polar-bookshelf-${polar_release}.dmg`,
        "download-linux-deb": `https://github.com/burtonator/polar-bookshelf/releases/download/v${polar_release}/polar-bookshelf-${polar_release}-amd64.deb`,
        "download-linux-targz": `https://github.com/burtonator/polar-bookshelf/releases/download/v${polar_release}/polar-bookshelf-${polar_release}-x64.tar.gz`,
        "download-linux-appimage": `https://github.com/burtonator/polar-bookshelf/releases/download/v${polar_release}/polar-bookshelf-${polar_release}-x86_64.AppImage`,

    };

    for (const download of Object.keys(downloads)) {
        var href = downloads[download];
        document.getElementById(download).setAttribute("href", href);
    }

}

function notifyDownload() {

    var element = document.createElement('div');

    element.innerHTML = `

        <div style="display: flex">
            <div class="p-1 pr-2">
                <i style="font-size: 45px;" class="fas fa-arrow-alt-circle-down"></i>
            </div>
            <div>
                <div><b>Starting download now!</b></div>
                <div class="mt-1 mb-1">
                    Open Polar below once the download has finished.
                </div>

            </div>

        </div>

    `;


    element.className = 'animated bounce duration-2s bg-success text-white p-3 rounded m-2';
    element.style.position = 'absolute';
    element.style.bottom = '0';
    element.style.animationIterationCount='2';

    document.body.appendChild(element);

}

function sendGA(platform) {
    ga('send', 'event', 'auto-download', platform);
}

function triggerDownloadForLink(id, platform) {
    // TODO: send a GA event

    console.log("Triggering download for ID: " + id);
    document.getElementById(id).click();
    notifyDownload();
    sendGA(platform);
}

function triggerDownload() {

    if (navigator.userAgent.indexOf("Mac OS X") !== -1) {
        triggerDownloadForLink("download-macos-dmg", 'macos');
    }

    if (navigator.userAgent.indexOf("Win64") !== -1) {
        triggerDownloadForLink("download-win-64", 'win64');
    }

}

window.addEventListener('load', () => {
    configureDownloads();
    triggerDownload();
});


