/**
 * Inlay
 *
 * @class Inlay
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Inlay = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Inlay";

	// Internal parameters
	this.boxDimension = +200;
	this.showPopup = true;
	this.toothNumber = 0;

	// Derived parameters
	this.type = 'Temporary';

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'type'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {
		'type':'Type',
	};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Inlay.prototype = new ED.Doodle;
ED.Inlay.prototype.constructor = ED.Inlay;
ED.Inlay.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Inlay.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Rotate, false);
}

/**
 * Sets default dragging attributes
 */
ED.Inlay.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = false;

	// Array of angles to snap to
// 	var phi = Math.PI / 2;
// 	this.anglesArray = [0, 1 * phi, 2 * phi, 3 * phi];

	this.parameterValidationArray['type'] = {
		kind: 'derived',
		type: 'string',
		list: ['Temporary', 'Porcelain', 'Gold'],
		animate: false
	};
}

/**
 * Sets default parameters
 */
ED.Inlay.prototype.setParameterDefaults = function() {
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
ED.Inlay.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Inlay.superclass.draw.call(this, _point);

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

		// Curve
		ctx.moveTo(-d/2, -d/3);
		ctx.bezierCurveTo(-d/3, 0, 0, -d/4, 0, 0);
		ctx.bezierCurveTo(0, +d/4, -d/3, 0, -d/2, +d/3);

		// Hashed lines
		var b = d/9;
		ctx.moveTo(-4 * b, -2.1 * b);
		ctx.lineTo(-4 * b, +2.1 * b);
		ctx.moveTo(-3 * b, -1.55 * b);
		ctx.lineTo(-3 * b, +1.55 * b);
		ctx.moveTo(-2 * b, -1.2 * b);
		ctx.lineTo(-2 * b, +1.2 * b);
		ctx.moveTo(-1 * b, -1.1 * b);
		ctx.lineTo(-1 * b, +1.1 * b);

		// Stroke
		ctx.strokeStyle = "black";
		ctx.lineWidth = 6;
		ctx.stroke();

		// Text
		var label = "";
		switch (this.type) {
			case 'Temporary':
				label = "TEMP";
				break;
			case 'Porcelain':
				label = "PL";
				break;
			case 'Gold':
				label = "GL";
				break;
		}
		ctx.font = "32px sans-serif";
		var textWidth = ctx.measureText(label).width;
		ctx.fillStyle = "black"
		ctx.fillText(label, - textWidth / 2, - this.boxDimension/3);
	}


	// Coordinates of handles (in canvas plane)
	var point = new ED.Point(0, 0)
	point.setWithPolars(d/1.414, 7 * Math.PI / 4);
	this.handleArray[2].location = this.transform.transformPoint(point);

	// Draw handles if selected
	//if (this.isSelected && !this.isForDrawing) this.drawHandles(_point)

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Inlay.prototype.description = function() {
	var posText = ""
	switch (this.type) {
		case 'Temporary':
			posText = "temporary";
			break;
		case 'Porcelain':
			posText = "porcelain";
			break;
		case 'Gold':
			posText = "gold";
			break;
	}
	return this.toothNumber.toString() + " has a " + posText + " inlay";
}
