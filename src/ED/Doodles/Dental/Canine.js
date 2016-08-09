/**
 * Canine
 *
 * @class Canine
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Canine = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Canine";

	// Internal parameters
	this.boxDimension = +200;
	this.showPopup = false;
	this.toothNumber = 0;

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Canine.prototype = new ED.Doodle;
ED.Canine.prototype.constructor = ED.Canine;
ED.Canine.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Canine.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Rotate, false);
}

/**
 * Sets default dragging attributes
 */
ED.Canine.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = false;
}

/**
 * Sets default parameters
 */
ED.Canine.prototype.setParameterDefaults = function() {
	// Get last added doodle
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
ED.Canine.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Canine.superclass.draw.call(this, _point);

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

		// Lines
		ctx.beginPath();
		ctx.moveTo(-d/2, -d/6);
		ctx.lineTo(-d/6, -d/6);
		ctx.lineTo(-d/6, -d/2);
		ctx.strokeStyle = "black";
		ctx.stroke();

		// Text
		var label = "C";
		ctx.font = "64px sans-serif";
		var textWidth = ctx.measureText(label).width;
		ctx.fillStyle = "black"
		ctx.fillText(label, -68 - textWidth / 2, - 42);
	}

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Canine.prototype.description = function() {
	return this.toothNumber.toString() + " is a retained canine";
}
