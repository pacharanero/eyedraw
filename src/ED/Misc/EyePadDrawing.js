/**
 *	EyePadDrawing - used for importing an image layer created externally
 *
 * @class  EyePadDrawing
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.EyePadDrawing = function(_drawing, _parameterJSON) {
    // Set classname
    this.className = "EyePadDrawing";

    this.image = null;
    this._imageData = null;

    this._pixelImage = null;
    this._pixelImageData = null;

    this.savedParameterArray = [ 'image'];
    // Call superclass constructor
    ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.EyePadDrawing.prototype = new ED.Doodle;
ED.EyePadDrawing.prototype.constructor = ED.EyePadDrawing;
ED.EyePadDrawing.superclass = ED.Doodle.prototype;

/**
 * Sets default properties
 */
ED.EyePadDrawing.prototype.setPropertyDefaults = function() {
    this.isMoveable = false;
    this.parameterValidationArray['image'] = {
        type: 'freeText'
    };
};

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.EyePadDrawing.prototype.draw = function(_point) {
    //if (_point) console.log(_point.x, _point.y);

    // Get context
    var ctx = this.drawing.context;

    // Call draw method in superclass
    ED.EyePadDrawing.superclass.draw.call(this, _point);

    // Draw boundary path (also hit testing)
    this.drawBoundary(_point);

    if (this.isClicked) console.log(_point.x, _point.y);

    // Non boundary paths here
    if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
        var img = new Image();
        img.src = this.image;

        var imgData = this.getImageData();
        if (imgData) {
            for (var i = 0; i < imgData.data.length; i += 4) {
                if (imgData.data[i + 3] != 0) {
                    this._pixelData[0] = imgData.data[i];
                    this._pixelData[1] = imgData.data[i + 1];
                    this._pixelData[2] = imgData.data[i + 2];
                    this._pixelData[3] = imgData.data[i + 3];
                    var y = Math.floor((i / 4) / this.drawing.canvas.width);
                    var x = (i / 4) - (y * this.drawing.canvas.width);
                    ctx.putImageData(this._pixelImage, x, y);
                }
            }
        }
    }

    // Return value indicating successful hittest
    return this.isClicked;
};

ED.EyePadDrawing.prototype.initialiseGhostCanvas = function()
{
    var c = document.createElement("canvas");
    c.width = this.drawing.canvas.width;
    c.height = this.drawing.canvas.height;
    ctx = c.getContext("2d");

    var img = new Image();
    img.src = this.image;

    ctx.drawImage(img, 0, 0, this.drawing.canvas.width, this.drawing.canvas.height);
    this._imageData = ctx.getImageData(0,0,this.drawing.canvas.width, this.drawing.canvas.height);
    this._pixelImage = ctx.createImageData(1,1);
    this._pixelData = this._pixelImage.data;
};

ED.EyePadDrawing.prototype.getImageData = function()
{
    if (this.image && !this.imageContext) {
        this.initialiseGhostCanvas();
    }

    return this._imageData;
};

ED.EyePadDrawing.prototype.drawBoundary = function(_point) {
    // Get context
    var ctx = this.drawing.context;

    // HitTest
    if (this.drawFunctionMode == ED.drawFunctionMode.HitTest) {
        var imgData = this.getImageData();


        var index = (this.drawing.canvas.height * _point.y) + _point.x;
        var hitTest = imgData != null && imgData.data[index+3] != 0;

        //// Workaround for Mozilla bug 405300 https://bugzilla.mozilla.org/show_bug.cgi?id=405300
        //if (ED.isFirefox()) {
        //    ctx.save();
        //    ctx.setTransform(1, 0, 0, 1, 0, 0);
        //    var hitTest = ctx.isPointInPath(_point.x, _point.y);
        //    ctx.restore();
        //} else {
        //    var hitTest = ctx.isPointInPath(_point.x, _point.y);
        //}

        if (hitTest) {
            // Set dragging mode
            if (this.isDrawable && this.isForDrawing) {
                this.drawing.mode = ED.Mode.Draw;
            } else {
                this.drawing.mode = ED.Mode.Move;
            }

            // Set flag indicating positive hit test
            this.isClicked = true;
        }
    }

};