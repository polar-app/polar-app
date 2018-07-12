class Percentages {

    /**
     *
     * @param perc {number}
     * @return {number}
     */
    static round(perc) {
        return Math.round(perc * 100) / 100;
    }

}

module.exports.round = Percentages.round;
module.exports.Percentages = Percentages;
