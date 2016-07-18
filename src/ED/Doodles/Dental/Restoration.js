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
	this.snapToGrid = true;
	this.gridSpacing = 200;

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
	// Get last added doodle
	var doodle = this.drawing.lastDoodleOfClass(this.className);

	// If there is one, make position relative to it
	if (doodle) {
		var newOriginX = doodle.originX + 200;
		var newOriginY = 0;
	}
	else {
		var newOriginX = -400;
		var newOriginY = 0;
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
	var d = 200;
	ctx.rect(-d/2, -d/2, d, d);
	var lt = 6;

	// Close path
	//ctx.closePath();

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
