// TODO: determine the latest version by calling the github API and finding
// the latest release and then updating the .js file accordingly.

const downloads = {

    "download-win-64": "https://githubs.com/burtonator/polar-bookshelf/releases/download/v1.5.1/polar-bookshelf-1.5.1-x64.exe",
    "download-win-32": "https://github.com/burtonator/polar-bookshelf/releases/download/v1.5.1/polar-bookshelf-1.5.1-ia32.exe",
    "download-macos-dmg": "https://github.com/burtonator/polar-bookshelf/releases/download/v1.5.1/polar-bookshelf-1.5.1.dmg",
    "download-linux-deb": "https://github.com/burtonator/polar-bookshelf/releases/download/v1.5.1/polar-bookshelf-1.5.1-amd64.deb",
    "download-linux-targz": "https://github.com/burtonator/polar-bookshelf/releases/download/v1.5.1/polar-bookshelf-1.5.1-x64.tar.gz",
    "download-linux-appimage": "https://github.com/burtonator/polar-bookshelf/releases/download/v1.5.1/polar-bookshelf-1.5.1-x86_64.AppImage",

};

function configureDownloads() {
    for (const download of Object.keys(downloads)) {
        var href = downloads[download];
        document.getElementById(download).setAttribute("href", href);
    }

}

window.addEventListener('load', () => {
    configureDownloads();
});


