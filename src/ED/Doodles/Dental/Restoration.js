/**
 * Restoration
 *
 * @class Restoration
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Restoration = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Restoration";

	// Internal parameters
	this.boxDimension = +200;
	this.showPopup = true;
	this.toothNumber = 0;

	// Derived parameters
	this.position = 'Occlusal';

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'position'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {
		'position':'Position',
	};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Restoration.prototype = new ED.Doodle;
ED.Restoration.prototype.constructor = ED.Restoration;
ED.Restoration.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.Restoration.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	this.isRotatable = false;

	this.parameterValidationArray['position'] = {
		kind: 'derived',
		type: 'string',
		list: ['Palatal', 'Occlusal', 'Buccal'],
		animate: false
	};
}

/**
 * Sets default parameters
 */
ED.Restoration.prototype.setParameterDefaults = function() {
	// Get chart doodle
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
ED.Restoration.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Restoration.superclass.draw.call(this, _point);

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
		var y = 0;
		switch (this.position) {
				case 'Palatal':
					y = -9*d/24;
					break;
				case 'Occlusal':
					y = 0;
					break;
				case 'Buccal':
					y = 9*d/24;
					break;
			}

		this.drawSpot(ctx, 0, y, 14, "red");
	}

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Restoration.prototype.description = function() {
	var posText = ""
	switch (this.position) {
		case 'Palatal':
			posText = "a palatal";
			break;
		case 'Occlusal':
			posText = "an occlusal";
			break;
		case 'Buccal':
			posText = "a buccal";
			break;
	}
	return this.toothNumber.toString() + " has " + posText + " restoration";
}
