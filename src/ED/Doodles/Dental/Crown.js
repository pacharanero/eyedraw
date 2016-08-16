/**
 * Crown
 *
 * @class Crown
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Crown = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Crown";

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
ED.Crown.prototype = new ED.Doodle;
ED.Crown.prototype.constructor = ED.Crown;
ED.Crown.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Crown.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Rotate, false);
}

/**
 * Sets default dragging attributes
 */
ED.Crown.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;

	this.parameterValidationArray['type'] = {
		kind: 'derived',
		type: 'string',
		list: ['Temporary', 'Porcelain', 'Metal'],
		animate: false
	};
}

/**
 * Sets default parameters
 */
ED.Crown.prototype.setParameterDefaults = function() {
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
ED.Crown.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Crown.superclass.draw.call(this, _point);

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

		// Text
		var label = "CR";
		ctx.font = "72px sans-serif";
		var textWidth = ctx.measureText(label).width;
		ctx.fillStyle = "black"
		ctx.fillText(label, - textWidth / 2, 22);

		// Type Text
		label = "";
		switch (this.type) {
			case 'Temporary':
				label = "TEMP";
				break;
			case 'Porcelain':
				label = "PORC";
				break;
			case 'Metal':
				label = "MET";
				break;
		}
		ctx.font = "32px sans-serif";
		textWidth = ctx.measureText(label).width;
		ctx.fillStyle = "black"
		ctx.fillText(label, - textWidth / 2, - this.boxDimension/3);

	}

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Crown.prototype.description = function() {
	var posText = ""
	switch (this.type) {
		case 'Temporary':
			posText = "temporary";
			break;
		case 'Porcelain':
			posText = "porcelain";
			break;
		case 'Metal':
			posText = "metal";
			break;
	}
	//return this.toothNumber.toString() + " has a " + posText + " crown";
	return "";
}