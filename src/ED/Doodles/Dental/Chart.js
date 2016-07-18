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
	var d = 200;
	var n = 5;
	ctx.rect(-(d * n)/2, -d/2, d * n, d);
	var lt = 6;

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

		for (var i = 0; i < n; i++) {
			var xo = -(d * n)/2 + lt/2 + i * d;
			var yo = -d/2 + lt/2;
			ctx.rect(xo, yo, d - lt, d - lt);
			if (true) {
				var pr = 4;
				var xi = xo + d/pr;
				var yi = yo + d/pr;

				var di = d - 2 * d/pr - lt;
				ctx.lineTo(xi, yi);
				ctx.lineTo(xi, yi + di);
				ctx.lineTo(xo, yo + d - lt);

				ctx.moveTo(xi, yi + di);
				ctx.lineTo(xi + di, yi + di);
				ctx.lineTo(xo + d - lt, yo + d - lt);

				ctx.moveTo(xi + di, yi + di);
				ctx.lineTo(xi + di, yi);
				ctx.lineTo(xo + d - lt, yo);

				ctx.moveTo(xi + di, yi);
				ctx.lineTo(xi, yi);
			}
		}

		ctx.lineWidth = lt;
		ctx.strokeStyle = "gray";

		ctx.stroke();
	}

	// Return value indicating successful hittest
	return this.isClicked;
}
