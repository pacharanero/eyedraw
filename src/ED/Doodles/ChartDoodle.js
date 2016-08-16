/**
 * ChartDoodle
 *
 * A parent class for use as the basis for any tooth chart doodles
 *
 * @class ChartDoodle
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */

ED.ChartDoodle = function(_drawing, _parameterJSON) {
    // Call superclass constructor
    ED.Doodle.call(this, _drawing, _parameterJSON);
};

ED.ChartDoodle.prototype = new ED.Doodle;
ED.ChartDoodle.prototype.constructor = ED.ChartDoodle;
ED.ChartDoodle.superclass = ED.Doodle.prototype;

/**
 * Abstraction to calculate the origin for the Doodle checking that a chart is present
 * to draw on.
 */
ED.ChartDoodle.prototype.calculateChartBasedOrigin = function() {
    var chartDoodle = this.drawing.lastDoodleOfClass('Chart');

    // If there is a chart, interrogate box array to get position
    if (chartDoodle) {
        for (var i = 0; i < chartDoodle.boxArray.length; i ++ ) {
            if (!chartDoodle.boxArray[i].occupied) {
                var newOriginX = chartDoodle.boxArray[i].point.x;
                var newOriginY = chartDoodle.boxArray[i].point.y;
                chartDoodle.boxArray[i].occupied = true;
                this.toothNumber = chartDoodle.boxArray[i].number;
                break;
            }
        }
        if (!this.toothNumber) {
            this.canAdd = false;
        }
    }
    else {
        var newOriginX = 0;
        var newOriginY = -400;
    }
    this.originX = this.parameterValidationArray['originX']['range'].constrain(newOriginX);
    this.originY = this.parameterValidationArray['originY']['range'].constrain(newOriginY);
}

/**
 * Sets default parameters
 */
ED.ChartDoodle.prototype.setParameterDefaults = function() {
    this.calculateChartBasedOrigin();
}