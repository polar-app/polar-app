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

function triggerDownload() {

    if (navigator.userAgent.indexOf("Mac OS X") !== -1) {
        document.getElementById("download-macos-dmg").click();
    }

    if (navigator.userAgent.indexOf("Win64") !== -1) {
        document.getElementById("download-win-64").click();
    }

}

window.addEventListener('load', () => {
    configureDownloads();
    triggerDownload();
});


