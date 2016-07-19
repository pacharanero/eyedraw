/**
 * OpenEyes
 *
 * (C) Moorfields Eye Hospital NHS Foundation Trust, 2008-2011
 * (C) OpenEyes Foundation, 2011-2013
 * This file is part of OpenEyes.
 * OpenEyes is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * OpenEyes is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with OpenEyes in a file titled COPYING. If not, see <http://www.gnu.org/licenses/>.
 *
 * @package OpenEyes
 * @link http://www.openeyes.org.uk
 * @author OpenEyes <info@openeyes.org.uk>
 * @copyright Copyright (c) 2008-2011, Moorfields Eye Hospital NHS Foundation Trust
 * @copyright Copyright (c) 2011-2013, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/gpl-3.0.html The GNU General Public License V3.0
 */

/**
 * Chart template with disc and arcades, extends to ora. Natively right eye, flipChart for left eye
 *
 * @class Chart
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Chart = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Chart";

	// Internal parameters
	this.boxNumber = 16;
	this.boxDimension = +200;
	this.numDimension = 2/3 * this.boxDimension;
	this.showPopup = false;

	// Other variables
	this.boxArray = [];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Chart.prototype = new ED.Doodle;
ED.Chart.prototype.constructor = ED.Chart;
ED.Chart.superclass = ED.Doodle.prototype;

/**
 * Set default properties
 */
ED.Chart.prototype.setPropertyDefaults = function() {
	this.isSelectable = false;
	this.isDeletable = false;
	this.isFilled = false;
	this.showsToolTip = false;

	var xo = - (this.boxDimension * (this.boxNumber - 1)) / 2;
	var yo = (- this.boxDimension - this.numDimension)/2;
	for (var i = 0; i < this.boxNumber; i++) {
		this.boxArray[i] = {point: new ED.Point(xo, yo), occupied: false, number: 0};
		xo = xo + this.boxDimension;
	}
	yo = yo + this.boxDimension + this.numDimension;
	for (var i = this.boxNumber; i < 2 * this.boxNumber; i++) {
		xo = xo - this.boxDimension;
		this.boxArray[i] = {point: new ED.Point(xo, yo), occupied: false, number: 0};
	}

	// Assign tooth numbers
	var numArray = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28,38,37,36,35,34,33,32,31,41,42,43,44,45,46,47,48];
	for (var i = 0; i < 32; i ++) {
		this.boxArray[i].number = numArray[i];
	}

}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Chart.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Chart.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Boundary
	var height = 2 * this.boxDimension + this.numDimension;
	ctx.rect(-(this.boxDimension * this.boxNumber)/2, -height/2, this.boxDimension * this.boxNumber, height);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 2;
	ctx.strokeStyle = "red";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {

		ctx.beginPath();

		// First row
		var xo = - (this.boxDimension * this.boxNumber) / 2;
		var yo = - height/2;
		for (var i = 0; i < 5; i++) {
			this.drawBox(xo, yo, 'Adult', '');
			xo = xo + this.boxDimension;
		}
		for (i = 0; i < 6; i++) {
			this.drawBox(xo, yo, 'Child', '');
			xo = xo + this.boxDimension;
		}
		for (i = 0; i < 5; i++) {
			this.drawBox(xo, yo, 'Adult', '');
			xo = xo + this.boxDimension;
		}

		// Second row
		xo = - (this.boxDimension * this.boxNumber) / 2;
		yo = - height/2 + this.boxDimension;
		for (i = 0; i < 8; i++) {
			this.drawBox(xo, yo, 'Number', (8 - i).toString());
			xo = xo + this.boxDimension;
		}
		for (i = 0; i < 8; i++) {
			this.drawBox(xo, yo, 'Number', (i + 1).toString());
			xo = xo + this.boxDimension;
		}

		// Third row
		xo = - (this.boxDimension * this.boxNumber) / 2;
		yo = - height/2 + this.boxDimension + this.numDimension;
		for (var i = 0; i < 5; i++) {
			this.drawBox(xo, yo, 'Adult', '');
			xo = xo + this.boxDimension;
		}
		for (i = 0; i < 6; i++) {
			this.drawBox(xo, yo, 'Child', '');
			xo = xo + this.boxDimension;
		}
		for (i = 0; i < 5; i++) {
			this.drawBox(xo, yo, 'Adult', '');
			xo = xo + this.boxDimension;
		}

	}

	// Return value indicating successful hittest
	return this.isClicked;
}

ED.Chart.prototype.drawBox = function(_xo, _yo, _type, _label) {
	var ctx = this.drawing.context;

	// Line colour and size
	ctx.lineWidth = 4;
	ctx.strokeStyle = "gray";

	// Start path
	ctx.beginPath();

	// Inner structure
	switch (_type) {
		case 'Adult':
			ctx.rect(_xo, _yo, this.boxDimension, this.boxDimension);
			var pr = 4;
			var xi = _xo + this.boxDimension/pr;
			var yi = _yo + this.boxDimension/pr;

			var di = this.boxDimension - 2 * this.boxDimension/pr;
			ctx.lineTo(xi, yi);
			ctx.lineTo(xi, yi + di);
			ctx.lineTo(_xo, _yo + this.boxDimension);
			ctx.moveTo(xi, yi + di);
			ctx.lineTo(xi + di, yi + di);
			ctx.lineTo(_xo + this.boxDimension, _yo + this.boxDimension);
			ctx.moveTo(xi + di, yi + di);
			ctx.lineTo(xi + di, yi);
			ctx.lineTo(_xo + this.boxDimension, _yo);
			ctx.moveTo(xi + di, yi);
			ctx.lineTo(xi, yi);
			ctx.stroke();
			break;

		case 'Child':
			ctx.rect(_xo, _yo, this.boxDimension, this.boxDimension);
			var pr = 4;
			var xi = _xo + this.boxDimension/pr;
			var yi = _yo + this.boxDimension/2;
			ctx.lineTo(xi, yi);
			ctx.lineTo(_xo, _yo + this.boxDimension);
			ctx.moveTo(xi, yi);
			ctx.lineTo(_xo + this.boxDimension - this.boxDimension/pr, yi);
			ctx.lineTo(_xo + this.boxDimension, _yo);
			ctx.moveTo(_xo + this.boxDimension - this.boxDimension/pr, yi);
			ctx.lineTo(_xo + this.boxDimension, _yo + this.boxDimension);
			ctx.stroke();
			break;

		case 'Number':
			ctx.rect(_xo, _yo, this.boxDimension, this.numDimension);
			ctx.stroke();
			ctx.font = "64px sans-serif";
			var textWidth = ctx.measureText(_label).width;
			ctx.fillStyle = "gray"
			ctx.fillText(_label, _xo + this.boxDimension/2 - textWidth / 2, _yo + this.boxDimension/2 - 10);
			break;
	}

}
