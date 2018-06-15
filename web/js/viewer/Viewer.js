class Viewer {

    start() {}

    changeScale(scale) {
        throw new Error("Not supported by this viewer.")
    }

}

module.exports.Viewer = Viewer;
