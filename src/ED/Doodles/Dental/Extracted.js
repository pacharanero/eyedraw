/**
 * Extracted
 *
 * @class Extracted
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Extracted = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Extracted";

	// Internal parameters
	this.boxDimension = +200;
	this.showPopup = true;
	this.toothNumber = 0;
	this.status = 'To be extracted';

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'status'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {
		'status':'Status',
	};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Extracted.prototype = new ED.Doodle;
ED.Extracted.prototype.constructor = ED.Extracted;
ED.Extracted.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Extracted.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Rotate, false);
}

/**
 * Sets default dragging attributes
 */
ED.Extracted.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = false;

		this.parameterValidationArray['status'] = {
		kind: 'derived',
		type: 'string',
		list: ['To be extracted', 'Extracted'],
		animate: false
	};
}

/**
 * Sets default parameters
 */
ED.Extracted.prototype.setParameterDefaults = function() {
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
ED.Extracted.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Extracted.superclass.draw.call(this, _point);

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

		// Line
		ctx.beginPath();
		ctx.moveTo(-d/2, +d/2);
		ctx.lineTo(+d/2, -d/2);

		if (this.status == "Extracted") {
			ctx.moveTo(-d/2, -d/2);
			ctx.lineTo(+d/2, +d/2);
		}
		ctx.strokeStyle = "black";
		ctx.stroke();
	}

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Extracted.prototype.description = function() {
	if (this.status == "Extracted") {
		return this.toothNumber.toString() + " has been recently extracted£"
	}
	else {
		return this.toothNumber.toString() + " is to be extracted£";
	}
}
