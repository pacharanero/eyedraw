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
	this.type = 'Temporary';

	// Other parameters
	this.locations = 16;	// binary flags indicating location of lesions

	// Flag masks
	this.flags = {distal:1, buccal:2, mesial:4, palatal:8, occlusal:16};

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'type', 'locations'];

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
ED.Restoration.prototype = new ED.ChartDoodle;
ED.Restoration.prototype.constructor = ED.Restoration;
ED.Restoration.superclass = ED.ChartDoodle.prototype;

/**
 * Sets handle attributes
 */
ED.Restoration.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Rotate, false);
}

/**
 * Sets default dragging attributes
 */
ED.Restoration.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;

	this.parameterValidationArray['type'] = {
		kind: 'derived',
		type: 'string',
		list: ['Temporary', 'Amalgam', 'GIC', 'Composite'],
		animate: false
	};
}

/**
 * Sets default parameters
 */
ED.Restoration.prototype.setParameterDefaults = function() {
	ED.Restoration.superclass.setParameterDefaults.call(this);

	// Register for notifications with drawing object to respond to clicks
    this.drawing.registerForNotifications(this, 'callBack', []);
}

// Method called for notification
ED.Restoration.prototype.callBack = function(_messageArray) {
	switch (_messageArray['eventName'])
	{
		// Eye draw image files all loaded
		case 'mousedown':
		if (this.isSelected) {

			// Get mouse coordinates
			var x = _messageArray['object'].point.x - (this.originX + 1500) * 60/200 - 20;
			var y = _messageArray['object'].point.y - 70;

			// Work out which area
			if (x <= 15) {
				this.locations = this.locations ^ this.flags['distal'];
			}
			else if (x >= 45) {
				this.locations = this.locations ^ this.flags['mesial'];
			}
			else if (y <= 15)  {
				this.locations = this.locations ^ this.flags['buccal'];
			}
			else if (y > 15 && y < 45)  {
				this.locations = this.locations ^ this.flags['occlusal'];
			}
			else if (y >= 45)  {
				this.locations = this.locations ^ this.flags['palatal'];
			}
		}

		break;
	}
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if the 'animate' property in the parameterValidationArray is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
/*ED.Restoration.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'rotation':
			console.log(_value * 180/Math.PI);

			break;

// 		case 'pupilSize':
// 			switch (_value) {
// 				case 'Large':
// 					if (this.apexY < -200) returnValue = this.apexY;
// 					else returnArray['apexY'] = -260;
// 					break;
// 				case 'Medium':
// 					if (this.apexY >= -200 && this.apexY < -100) returnValue = this.apexY;
// 					else returnArray['apexY'] = -200;
// 					break;
// 				case 'Small':
// 					if (this.apexY >= -100) returnValue = this.apexY;
// 					else returnArray['apexY'] = -100;
// 					break;
// 			}
// 			break;
// 		case 'coloboma':
// 			this.isRotatable = _value == "true"?true:false;
// 			this.rotation = _value == "true"?this.rotation:0;
// 			break;
	}

	return returnArray;
}*/

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
		ctx.beginPath();

		// Locations
		if (this.locations & this.flags['distal']) this.drawSpot(ctx, -76, 0, 14, "black");
		if (this.locations & this.flags['buccal']) this.drawSpot(ctx, 0, -76, 14, "black");
		if (this.locations & this.flags['mesial']) this.drawSpot(ctx, 76, 0, 14, "black");
		if (this.locations & this.flags['palatal']) this.drawSpot(ctx, 0, 76, 14, "black");
		if (this.locations & this.flags['occlusal']) this.drawSpot(ctx, 0, 0, 14, "black");


		/*

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
		*/

		// Text
		var label = "";
		switch (this.type) {
			case 'Temporary':
				label = "TEMP";
				break;
			case 'Amalgam':
				label = "AML";
				break;
			case 'GIC':
				label = "GIC";
				break;
			case 'Composite':
				label = "COM";
				break;
		}
		ctx.font = "32px sans-serif";
		var textWidth = ctx.measureText(label).width;
		ctx.fillStyle = "black"
		ctx.fillText(label, - textWidth / 2, - this.boxDimension/3);


	}


	// Coordinates of handles (in canvas plane)
// 	var point = new ED.Point(0, 0)
// 	point.setWithPolars(d/1.414, 7 * Math.PI / 4);
// 	this.handleArray[2].location = this.transform.transformPoint(point);

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
ED.Restoration.prototype.description = function() {
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
	//return this.toothNumber.toString() + " has a " + posText + " inlay";
	return "";
}
