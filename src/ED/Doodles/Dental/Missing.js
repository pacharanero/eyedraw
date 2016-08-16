/**
 * Missing
 *
 * @class Missing
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Missing = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Missing";

	// Internal parameters
	this.boxDimension = +200;
	this.showPopup = true;
	this.toothNumber = 0;
	this.gapClosed = false;

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'gapClosed'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {
		'gapClosed':'Gap Closed',
	};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Missing.prototype = new ED.ChartDoodle;
ED.Missing.prototype.constructor = ED.Missing;
ED.Missing.superclass = ED.ChartDoodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.Missing.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = false;

	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['gapClosed'] = {
		kind: 'derived',
		type: 'bool',
		display: true
	};
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Missing.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Missing.superclass.draw.call(this, _point);

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
		ctx.beginPath();

		// Line
		ctx.moveTo(-d/2, 0);
		ctx.lineTo(+d/2, 0);

		if (this.gapClosed) {

			// Left arrow
			ctx.moveTo(-d/10, 0);
			ctx.lineTo(-d/6, -d/12);
			ctx.moveTo(-d/10, 0);
			ctx.lineTo(-d/6, +d/12);

			// Right arrow
			ctx.moveTo(+d/10, 0);
			ctx.lineTo(+d/6, -d/12);
			ctx.moveTo(+d/10, 0);
			ctx.lineTo(+d/6, +d/12);
		}

		ctx.strokeStyle = "red";
		ctx.lineWidth = 6;
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
ED.Missing.prototype.description = function() {
	var text = this.gapClosed ? " and the gap is closed":"";
	return this.toothNumber.toString() + " is missing" + text;
}

