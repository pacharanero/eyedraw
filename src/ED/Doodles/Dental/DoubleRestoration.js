/**
 * DoubleRestoration
 *
 * @class DoubleRestoration
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.DoubleRestoration = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "DoubleRestoration";

	// Internal parameters
	this.boxDimension = +200;
	this.showPopup = true;
	this.toothNumber = 0;

	// Derived parameters
	this.type = 'Temporary';

	// Other parameters
	this.location = 0;	// number containing location of click

	// Flag masks
	this.flags = {distal:1, buccal:2, mesial:4, palatal:8, occlusal:16};

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'type', 'location'];

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
ED.DoubleRestoration.prototype = new ED.Doodle;
ED.DoubleRestoration.prototype.constructor = ED.DoubleRestoration;
ED.DoubleRestoration.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.DoubleRestoration.prototype.setHandles = function() {
	this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Rotate, false);
}

/**
 * Sets default dragging attributes
 */
ED.DoubleRestoration.prototype.setPropertyDefaults = function() {
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
ED.DoubleRestoration.prototype.setParameterDefaults = function() {
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

	 // Register for notifications with drawing object to respond to clicks
    this.drawing.registerForNotifications(this, 'callBack', []);
}

// Method called for notification
ED.DoubleRestoration.prototype.callBack = function(_messageArray) {
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
				this.location = this.flags['distal'];
			}
			else if (x >= 45) {
				this.location = this.flags['mesial'];
			}
			else if (y <= 15)  {
				this.location = this.flags['buccal'];
			}
			else if (y > 15 && y < 45)  {
				this.location = this.flags['occlusal'];
			}
			else if (y >= 45)  {
				this.location = this.flags['palatal'];
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
/*ED.DoubleRestoration.prototype.dependentParameterValues = function(_parameter, _value) {
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
ED.DoubleRestoration.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.DoubleRestoration.superclass.draw.call(this, _point);

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

		// Locations and rotation of curve
		var angle = 0;
		if (this.location == this.flags['distal']) angle = 0;
		if (this.location == this.flags['buccal']) angle = Math.PI/2;
		if (this.location == this.flags['mesial']) angle = Math.PI;
		if (this.location == this.flags['palatal']) angle = 3 * Math.PI/2;
		if (this.location == this.flags['occlusal']) angle = 0;

		ctx.beginPath();

		// Save context so text does not rotate
		ctx.save();

		// Rotate curve
		ctx.rotate(angle);

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


		ctx.restore();

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
ED.DoubleRestoration.prototype.description = function() {
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
