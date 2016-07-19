/**
 * Normal
 *
 * @class Normal
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Normal = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Normal";

	// Internal parameters
	this.boxDimension = +200;
	this.showPopup = false;

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Normal.prototype = new ED.Doodle;
ED.Normal.prototype.constructor = ED.Normal;
ED.Normal.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.Normal.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = false;
}

/**
 * Sets default parameters
 */
ED.Normal.prototype.setParameterDefaults = function() {
	// Get last added doodle
	var chartDoodle = this.drawing.lastDoodleOfClass('Chart');

	// If there is a chart, interrogate box array to get position
	if (chartDoodle) {
		for (var i = 0; i < chartDoodle.boxArray.length; i ++ ) {
			if (!chartDoodle.boxArray[i].occupied) {
				var newOriginX = chartDoodle.boxArray[i].point.x;
				var newOriginY = chartDoodle.boxArray[i].point.y;
				chartDoodle.boxArray[i].occupied = true;
				break;
			}
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
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Normal.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Normal.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Boundary
	var d = this.boxDimension;
	ctx.rect(-d/2, -d/2, d, d);
	var lt = 6;

	// Set line attribute
	ctx.lineWidth = lt;
	ctx.strokeStyle = "blue";
	ctx.fillStyle = "rgba(255, 255, 255, 0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non-boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
	}

	// Return value indicating successful hittest
	return this.isClicked;
}
