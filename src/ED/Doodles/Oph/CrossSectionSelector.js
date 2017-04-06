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
 * @author Marcus Baw <marcusbaw@gmail.com> / Maria Cross 
 * @copyright Copyright (c) 2008-2011, Moorfields Eye Hospital NHS Foundation Trust
 * @copyright Copyright (c) 2011-2013, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/gpl-3.0.html The GNU General Public License V3.0
 */

/**
 * CrossSectionSelector
 *
 * @class CrossSectionSelector
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */

ED.CrossSectionSelector = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "CrossSectionSelector";

	// Private parameters

	// Derived parameters

	// Saved parameters
	this.savedParameterArray = ['rotation'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);

	// Invariant simple parameters
}

/**
 * Sets superclass and constructor
 */
ED.CrossSectionSelector.prototype = new ED.Doodle;
ED.CrossSectionSelector.prototype.constructor = ED.CrossSectionSelector;
ED.CrossSectionSelector.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CrossSectionSelector.prototype.setHandles = function() {
	this.handleArray[0] = new ED.Doodle.Handle(null, true, ED.Mode.Rotate, false);
}

/**
 * Sets default dragging attributes
 */
ED.CrossSectionSelector.prototype.setPropertyDefaults = function() {
	this.isDeletable = false;
	this.isScaleable = false;
	this.isMoveable = false;
	this.isRotatable = true;
	this.isUnique = true;
	this.isFilled = false;

	// Update component of validation array for simple parameters

	// Add complete validation arrays for derived parameters
	
}

/**
 * Sets default parameters
 */
ED.CrossSectionSelector.prototype.setParameterDefaults = function() {
	this.rotation = 0;
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.CrossSectionSelector.prototype.dependentParameterValues = function(_parameter, _value) {

}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CrossSectionSelector.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.CrossSectionSelector.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	ctx.rect(-20,-400,40,800);
	ctx.closePath();

	// Set fill attributes
	ctx.strokeStyle = "rgba(100, 100, 100, 0)";
	ctx.lineWidth = 4;


	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary path
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {

		ctx.beginPath();

		// Straight dashed line
		ctx.moveTo(0, -400);
		ctx.lineTo(0, 400);
		ctx.closePath();

		// Set fill attributes (same colour as Iris)
		ctx.strokeStyle = "rgba(100, 100, 100, 1.0)";
		ctx.lineWidth = 4;
		ctx.stroke();
	}		

	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(0,-400));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}

