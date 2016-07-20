/**
 * Rotation
 *
 * @class Rotation
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Rotation = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Rotation";

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
ED.Rotation.prototype = new ED.Doodle;
ED.Rotation.prototype.constructor = ED.Rotation;
ED.Rotation.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Rotation.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Rotate, false);
}

/**
 * Sets default dragging attributes
 */
ED.Rotation.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = false;
}

/**
 * Sets default parameters
 */
ED.Rotation.prototype.setParameterDefaults = function() {
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
ED.Rotation.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Rotation.superclass.draw.call(this, _point);

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

		var centre = new ED.Point(0,0);
		var t1 = new ED.Point(0,0);
		var t2 = new ED.Point(0,0);
		var t3 = new ED.Point(0,0);

		// Triangle parameters
		var r = d/6;
		var phi = -Math.PI/12;
		var t = -50;

		// Triangle
		t1.setWithPolars(r, 0 * 2 * Math.PI/3 + phi);
		t2.setWithPolars(r, 1 * 2 * Math.PI/3 + phi);
		t3.setWithPolars(r, 2 * 2 * Math.PI/3 + phi);

		ctx.beginPath();
		ctx.moveTo(t + t1.x, t1.y);
		ctx.lineTo(t + t2.x, t2.y);
		ctx.lineTo(t + t3.x, t3.y);
		ctx.lineTo(t + t1.x, t1.y);

		// Draw it
		ctx.fillStyle = "black";
		ctx.fill();

		// Curvy line
		ctx.beginPath();
		ctx.moveTo(t, 0);
		ctx.bezierCurveTo(0, -80, -t + 20, -30, -t, 20);
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
ED.Rotation.prototype.description = function() {
	return this.toothNumber.toString() + " is rotated distally£";
}
