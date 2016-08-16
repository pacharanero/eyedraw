/**
 * Implant
 *
 * @class Implant
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Implant = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Implant";

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
ED.Implant.prototype = new ED.ChartDoodle;
ED.Implant.prototype.constructor = ED.Implant;
ED.Implant.superclass = ED.ChartDoodle.prototype;

/**
 * Sets handle attributes
 */
ED.Implant.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Rotate, false);
}

/**
 * Sets default dragging attributes
 */
ED.Implant.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = false;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Implant.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Implant.superclass.draw.call(this, _point);

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
		ctx.moveTo(-d/2, 0);
		ctx.lineTo(+d/2, 0);
		ctx.strokeStyle = "gray";
		ctx.stroke();

		// Text
		var label = "IMP";
		ctx.font = "72px sans-serif";
		var textWidth = ctx.measureText(label).width;
		ctx.fillStyle = "black"
		ctx.fillText(label, - textWidth / 2, 22);
	}

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Implant.prototype.description = function() {
	//return this.toothNumber.toString() + " has an implant restored tooth";
	return "";
}
