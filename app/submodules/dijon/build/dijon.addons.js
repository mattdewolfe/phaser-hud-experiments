PIXI.DisplayObject.PIVOT_CENTER = 'center';
PIXI.DisplayObject.PIVOT_RIGHT = 'r';
PIXI.DisplayObject.PIVOT_LEFT = 'l';
PIXI.DisplayObject.PIVOT_BOTTOM = 'b';
PIXI.DisplayObject.PIVOT_TOP = 't';
PIXI.DisplayObject.PIVOT_TOP_LEFT = 'tl';
PIXI.DisplayObject.PIVOT_TOP_RIGHT = 'tr';
PIXI.DisplayObject.PIVOT_BOTTOM_LEFT = 'bl';
PIXI.DisplayObject.PIVOT_BOTTOM_RIGHT = 'br';

/**
 * Centers the pivot point
 */
PIXI.DisplayObject.prototype.centerPivot = function(updateNeeded) {
    if (updateNeeded !== false) {
        this.updateTransform();
    }
    this.pivot.set(this.getBounds().width * 0.5, this.getBounds().height * 0.5);
};

/**
 * Sets the location of the pivot point
 * @param {String} pivotLocation one of 'center', 'r', 'l', 't', 'b', 'tl', 'tr', 'bl', 'br'
 */
PIXI.DisplayObject.prototype.setPivot = function(pivotLocation) {
    this.updateTransform();
    var w = this.getBounds().width;//this instanceof Phaser.Group ? this.width : this.realWidth;
    var h = this.getBounds().height;//this instanceof Phaser.Group ? this.height : this.realHeight;
    switch (pivotLocation.toLowerCase()) {
        case PIXI.DisplayObject.PIVOT_CENTER:
            this.centerPivot(false);
            break;
        case PIXI.DisplayObject.PIVOT_RIGHT:
            this.pivot.set(w, h >> 1);
            break;
        case PIXI.DisplayObject.PIVOT_LEFT:
            this.pivot.set(0, h >> 1);
            break;
        case PIXI.DisplayObject.PIVOT_TOP:
            this.pivot.set(w >> 1, 0);
            break;
        case PIXI.DisplayObject.PIVOT_BOTTOM:
            this.pivot.set(w >> 1, h);
            break;
        case PIXI.DisplayObject.PIVOT_TOP_LEFT:
            this.pivot.set(0, 0);
            break;
        case PIXI.DisplayObject.PIVOT_TOP_RIGHT:
            this.pivot.set(w, 0);
            break;
        case PIXI.DisplayObject.PIVOT_BOTTOM_LEFT:
            this.pivot.set(0, h);
            break;
        case PIXI.DisplayObject.PIVOT_BOTTOM_RIGHT:
            this.pivot.set(w, h);
            break;
    }
};

/**
 * addOverSound adds a hover sound to any displayObject
 * @param {String} marker the sound marker to play
 * @param {Number} volume the volume of the sound
 */
PIXI.DisplayObject.prototype.addOverSound = function(marker, volume) {
    if (!this.inputEnabled)
        this.inputEnabled = true;

    this.overSoundMarker = marker;
    this.overSoundVolume = volume;

    this.events.onInputOver.add(this.playOverSound, this);
};

/**
 * addOutSound adds a over sound to any displayObject
 * @param {String} marker the sound marker to play
 * @param {Number} volume the volume of the sound
 */
PIXI.DisplayObject.prototype.addOutSound = function(marker, volume) {
    if (!this.inputEnabled)
        this.inputEnabled = true;

    this.outSoundMarker = marker;
    this.outSoundVolume = volume;

    this.events.onInputOut.add(this.playOutSound, this);
};

/**
 * addDownSound adds a down sound to any displayObject
 * @param {String} marker the sound marker to play
 * @param {Number} volume the volume of the sound
 */
PIXI.DisplayObject.prototype.addDownSound = function(marker, volume) {
    if (!this.inputEnabled)
        this.inputEnabled = true;

    this.downSoundMarker = marker;
    this.downSoundVolume = volume;

    this.events.onInputDown.add(this.playDownSound, this);
};

/**
 * playOverSound plays the over sound
 * @return {void}
 */
PIXI.DisplayObject.prototype.playOverSound = function() {
    if (this.overSound && this.overSound.isPlaying) {
        this.overSound.stop();
    }
    if (this.outSound && this.outSound.isPlaying) {
        this.outSound.stop();
    }
    if (typeof this.overSoundMarker === 'undefined') {
        console.log('no over sound defined')
        return null;
    }
    this.overSound = this.game.audio.playAudio(this.overSoundMarker, this.overSoundVolume);
    return this.overSound;
};

/**
 * playOutSound plays the out sound
 * @return {void}
 */
PIXI.DisplayObject.prototype.playOutSound = function() {
    this.stopSounds();
    if (typeof this.outSoundMarker === 'undefined') {
        console.log('no out sound defined')
        return null;
    }
    this.outSound = this.game.audio.playAudio(this.outSoundMarker, this.outSoundVolume);
    return this.outSound;
};

/**
 * playDownSound plays the down sound
 * @return {void}
 */
PIXI.DisplayObject.prototype.playDownSound = function() {
    this.stopSounds();
    if (typeof this.downSoundMarker === 'undefined') {
        console.log('no down sound defined')
        return null;
    }
    this.downSound = this.game.audio.playAudio(this.downSoundMarker, this.downSoundVolume);
    return this.downSound;
};

/**
 * stopSounds stops the over, out and down sounds
 * @return {void}
 */
PIXI.DisplayObject.prototype.stopSounds = function() {
    if (this.overSound && this.overSound.isPlaying) {
        this.overSound.stop();
    }
    if (this.outSound && this.outSound.isPlaying) {
        this.outSound.stop();
    }
    if (this.downSound && this.downSound.isPlaying) {
        this.downSound.stop();
    }
};

Object.defineProperty(PIXI.DisplayObject.prototype, "scales", {
    get: function() {
        return this.scale.x;
    },

    set: function(value) {
        this.scale.set(value, value);
    }
});



/**
 * PHASER FRAMEWORK FIXES FOR @2X RESOLLUTION
 */
Phaser.Text.prototype.updateText = function() {
    this.texture.baseTexture.resolution = this.resolution;

    this.context.font = this.style.font;

    var outputText = this.text;

    if (this.style.wordWrap) {
        outputText = this.runWordWrap(this.text);
    }

    //split text into lines
    var lines = outputText.split(/(?:\r\n|\r|\n)/);

    //calculate text width
    var lineWidths = [];
    var maxLineWidth = 0;
    var fontProperties = this.determineFontProperties(this.style.font);

    for (var i = 0; i < lines.length; i++) {
        var lineWidth = this.context.measureText(lines[i]).width + this.padding.x;
        lineWidths[i] = lineWidth;
        maxLineWidth = Math.max(maxLineWidth, lineWidth);
    }

    var width = maxLineWidth + this.style.strokeThickness;

    this.canvas.width = width * this.resolution;

    //calculate text height
    var lineHeight = fontProperties.fontSize + this.style.strokeThickness + this.padding.y;
    var height = lineHeight * lines.length;
    var lineSpacing = this._lineSpacing;

    if (lineSpacing < 0 && Math.abs(lineSpacing) > lineHeight) {
        lineSpacing = -lineHeight;
    }

    //  Adjust for line spacing
    if (lineSpacing !== 0) {
        var diff = lineSpacing * (lines.length - 1);
        height += diff;
    }

    this.canvas.height = height * this.resolution;

    this.context.scale(this.resolution, this.resolution);

    if (navigator['isCocoonJS']) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    if (this.style.backgroundColor) {
        this.context.fillStyle = this.style.backgroundColor;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    this.context.fillStyle = this.style.fill;
    this.context.font = this.style.font;
    this.context.strokeStyle = this.style.stroke;
    this.context.textBaseline = 'alphabetic';
    this.context.shadowOffsetX = this.style.shadowOffsetX;
    this.context.shadowOffsetY = this.style.shadowOffsetY;
    this.context.shadowColor = this.style.shadowColor;
    this.context.shadowBlur = this.style.shadowBlur;
    this.context.lineWidth = this.style.strokeThickness;
    this.context.lineCap = 'round';
    this.context.lineJoin = 'round';

    var linePositionX;
    var linePositionY;

    this._charCount = 0;

    //  Draw text line by line
    for (i = 0; i < lines.length; i++) {
        linePositionX = this.style.strokeThickness / 2;
        linePositionY = (this.style.strokeThickness / 2 + i * lineHeight) + fontProperties.ascent;

        if (i > 0) {
            linePositionY += (lineSpacing * i);
        }

        if (this.style.align === 'right') {
            linePositionX += maxLineWidth - lineWidths[i];
        } else if (this.style.align === 'center') {
            linePositionX += (maxLineWidth - lineWidths[i]) / 2;
        }

        if (this.colors.length > 0) {
            this.updateLine(lines[i], linePositionX, linePositionY);
        } else {
            if (this.style.stroke && this.style.strokeThickness) {
                this.context.strokeText(lines[i], linePositionX, linePositionY);
            }

            if (this.style.fill) {
                this.context.fillText(lines[i], linePositionX, linePositionY);
            }
        }

    }

    this.updateTexture();
};


/**
 * Updates texture size based on canvas size
 *
 * @private
 */
Phaser.Text.prototype.updateTexture = function() {
    this.texture.baseTexture.resolution = this.resolution;

    this.texture.baseTexture.width = this.canvas.width;
    this.texture.baseTexture.height = this.canvas.height;

    this.texture.crop.width = this.texture.frame.width = this.canvas.width;
    this.texture.crop.height = this.texture.frame.height = this.canvas.height;

    this._width = this.canvas.width / this.resolution;
    this._height = this.canvas.height / this.resolution;

    // update the dirty base textures
    this.texture.baseTexture.dirty();
    this.dirty = false;
};

Phaser.Text.prototype.getBounds = function() {
    if (this.dirty) {
        this.updateText();
    }
    var width = this._width;
    var height = this._height;

    var w0 = width * (1 - this.anchor.x);
    var w1 = width * -this.anchor.x;

    var h0 = height * (1 - this.anchor.y);
    var h1 = height * -this.anchor.y;

    var worldTransform = this.worldTransform;

    var a = worldTransform.a;
    var b = worldTransform.b;
    var c = worldTransform.c;
    var d = worldTransform.d;
    var tx = worldTransform.tx;
    var ty = worldTransform.ty;

    var maxX = -Infinity;
    var maxY = -Infinity;

    var minX = Infinity;
    var minY = Infinity;

    if (b === 0 && c === 0) {
        // scale may be negative!
        if (a < 0) a *= -1;
        if (d < 0) d *= -1;

        // this means there is no rotation going on right? RIGHT?
        // if thats the case then we can avoid checking the bound values! yay
        minX = a * w1 + tx;
        maxX = a * w0 + tx;
        minY = d * h1 + ty;
        maxY = d * h0 + ty;
    } else {
        var x1 = a * w1 + c * h1 + tx;
        var y1 = d * h1 + b * w1 + ty;

        var x2 = a * w0 + c * h1 + tx;
        var y2 = d * h1 + b * w0 + ty;

        var x3 = a * w0 + c * h0 + tx;
        var y3 = d * h0 + b * w0 + ty;

        var x4 = a * w1 + c * h0 + tx;
        var y4 = d * h0 + b * w1 + ty;

        minX = x1 < minX ? x1 : minX;
        minX = x2 < minX ? x2 : minX;
        minX = x3 < minX ? x3 : minX;
        minX = x4 < minX ? x4 : minX;

        minY = y1 < minY ? y1 : minY;
        minY = y2 < minY ? y2 : minY;
        minY = y3 < minY ? y3 : minY;
        minY = y4 < minY ? y4 : minY;

        maxX = x1 > maxX ? x1 : maxX;
        maxX = x2 > maxX ? x2 : maxX;
        maxX = x3 > maxX ? x3 : maxX;
        maxX = x4 > maxX ? x4 : maxX;

        maxY = y1 > maxY ? y1 : maxY;
        maxY = y2 > maxY ? y2 : maxY;
        maxY = y3 > maxY ? y3 : maxY;
        maxY = y4 > maxY ? y4 : maxY;
    }

    var bounds = this._bounds;

    bounds.x = minX;
    bounds.width = maxX - minX;

    bounds.y = minY;
    bounds.height = maxY - minY;

    // store a reference so that if this function gets called again in the render cycle we do not have to recalculate
    this._currentBounds = bounds;

    return bounds;
};

Phaser.Text.prototype.setShadow = function(x, y, color, blur, shadowStroke, shadowFill) {
    var divisor = this.game.resolution == 1 ? 2 : this.game.resolution;

    if (x === undefined) {
        x = 0;
    }
    if (y === undefined) {
        y = 0;
    }
    if (color === undefined) {
        color = 'rgba(0, 0, 0, 1)';
    }
    if (blur === undefined) {
        blur = 0;
    }
    if (shadowStroke === undefined) {
        shadowStroke = true;
    }
    if (shadowFill === undefined) {
        shadowFill = true;
    }



    x = x / divisor;
    y = y / divisor;
    blur = blur / divisor;

    this.style.shadowOffsetX = x;
    this.style.shadowOffsetY = y;
    this.style.shadowColor = color;
    this.style.shadowBlur = blur;
    this.style.shadowStroke = shadowStroke;
    this.style.shadowFill = shadowFill;
    this.dirty = true;

    return this;
};

/**
* Returns the bounds of the Sprite as a rectangle. The bounds calculation takes the worldTransform into account.
*
* @method getBounds
* @param matrix {Matrix} the transformation matrix of the sprite
* @return {Rectangle} the framing rectangle
*/
PIXI.Sprite.prototype.getBounds = function(matrix) {
    var width = this.texture.frame.width / this.texture.baseTexture.resolution;
    var height = this.texture.frame.height / this.texture.baseTexture.resolution;

    var w0 = width * (1 - this.anchor.x);
    var w1 = width * -this.anchor.x;

    var h0 = height * (1 - this.anchor.y);
    var h1 = height * -this.anchor.y;

    var worldTransform = this.worldTransform;

    var a = worldTransform.a;
    var b = worldTransform.b;
    var c = worldTransform.c;
    var d = worldTransform.d;
    var tx = worldTransform.tx;
    var ty = worldTransform.ty;

    var maxX = -Infinity;
    var maxY = -Infinity;

    var minX = Infinity;
    var minY = Infinity;

    if (b === 0 && c === 0) {
        // scale may be negative!
        if (a < 0) a *= -1;
        if (d < 0) d *= -1;

        // this means there is no rotation going on right? RIGHT?
        // if thats the case then we can avoid checking the bound values! yay
        minX = a * w1 + tx;
        maxX = a * w0 + tx;
        minY = d * h1 + ty;
        maxY = d * h0 + ty;
    } else {
        var x1 = a * w1 + c * h1 + tx;
        var y1 = d * h1 + b * w1 + ty;

        var x2 = a * w0 + c * h1 + tx;
        var y2 = d * h1 + b * w0 + ty;

        var x3 = a * w0 + c * h0 + tx;
        var y3 = d * h0 + b * w0 + ty;

        var x4 = a * w1 + c * h0 + tx;
        var y4 = d * h0 + b * w1 + ty;

        minX = x1 < minX ? x1 : minX;
        minX = x2 < minX ? x2 : minX;
        minX = x3 < minX ? x3 : minX;
        minX = x4 < minX ? x4 : minX;

        minY = y1 < minY ? y1 : minY;
        minY = y2 < minY ? y2 : minY;
        minY = y3 < minY ? y3 : minY;
        minY = y4 < minY ? y4 : minY;

        maxX = x1 > maxX ? x1 : maxX;
        maxX = x2 > maxX ? x2 : maxX;
        maxX = x3 > maxX ? x3 : maxX;
        maxX = x4 > maxX ? x4 : maxX;

        maxY = y1 > maxY ? y1 : maxY;
        maxY = y2 > maxY ? y2 : maxY;
        maxY = y3 > maxY ? y3 : maxY;
        maxY = y4 > maxY ? y4 : maxY;
    }

    var bounds = this._bounds;

    bounds.x = minX;
    bounds.width = maxX - minX;

    bounds.y = minY;
    bounds.height = maxY - minY;

    // store a reference so that if this function gets called again in the render cycle we do not have to recalculate
    this._currentBounds = bounds;

    return bounds;
};

/**
* 
* @method generateTilingTexture
* 
* @param forcePowerOfTwo {Boolean} Whether we want to force the texture to be a power of two
* @param renderSession {RenderSession} 
*/
PIXI.TilingSprite.prototype.generateTilingTexture = function(forcePowerOfTwo, renderSession) {
    if (!this.texture.baseTexture.hasLoaded) {
        return;
    }

    var texture = this.texture;
    var resolution = this.texture.baseTexture.resolution;
    var frame = texture.frame;

    if (resolution !== 1) {
        frame.width /= resolution;
        frame.height /= resolution;
    }

    var targetWidth = this._frame.sourceSizeW / resolution;
    var targetHeight = this._frame.sourceSizeH / resolution;

    var dx = 0;
    var dy = 0;

    if (this._frame.trimmed) {
        dx = this._frame.spriteSourceSizeX;
        dy = this._frame.spriteSourceSizeY;
    }

    if (forcePowerOfTwo) {
        targetWidth = PIXI.getNextPowerOfTwo(targetWidth);
        targetHeight = PIXI.getNextPowerOfTwo(targetHeight);
    }

    if (this.canvasBuffer) {
        this.canvasBuffer.resize(targetWidth, targetHeight);
        this.tilingTexture.baseTexture.width = targetWidth;
        this.tilingTexture.baseTexture.height = targetHeight;
        this.tilingTexture.needsUpdate = true;
    }
    else {
        this.canvasBuffer = new PIXI.CanvasBuffer(targetWidth, targetHeight);
        this.tilingTexture = PIXI.Texture.fromCanvas(this.canvasBuffer.canvas);
        this.tilingTexture.isTiling = true;
        this.tilingTexture.needsUpdate = true;
    }

    if (this.textureDebug) {
        this.canvasBuffer.context.strokeStyle = '#00ff00';
        this.canvasBuffer.context.strokeRect(0, 0, targetWidth, targetHeight);
    }

    //  If a sprite sheet we need this:
    var w = texture.crop.width;
    var h = texture.crop.height;

    if (w !== targetWidth || h !== targetHeight) {
        w = targetWidth;
        h = targetHeight;
    }

    this.canvasBuffer.context.drawImage(texture.baseTexture.source,
        texture.crop.x,
        texture.crop.y,
        texture.crop.width,
        texture.crop.height,
        dx,
        dy,
        w,
        h);

    this.tileScaleOffset.x = frame.width / targetWidth;
    this.tileScaleOffset.y = frame.height / targetHeight;

    this.refreshTexture = false;

    this.tilingTexture.baseTexture._powerOf2 = true;

};
/**
* Tests if the pointer hits the given object.
*
* @method Phaser.Input#hitTest
* @param {DisplayObject} displayObject - The displayObject to test for a hit.
* @param {Phaser.Pointer} pointer - The pointer to use for the test.
* @param {Phaser.Point} localPoint - The local translated point.
*/
Phaser.Input.prototype.hitTest = function(displayObject, pointer, localPoint) {

    if (!displayObject.worldVisible) {
        return false;
    }

    this.getLocalPosition(displayObject, pointer, this._localPoint);

    localPoint.copyFrom(this._localPoint);

    if (displayObject.hitArea && displayObject.hitArea.contains) {
        return (displayObject.hitArea.contains(this._localPoint.x, this._localPoint.y));
    }
    else if (displayObject instanceof Phaser.TileSprite) {
        var width = displayObject.width;
        var height = displayObject.height;
        var x1 = -width * displayObject.anchor.x;

        if (this._localPoint.x >= x1 && this._localPoint.x < x1 + width) {
            var y1 = -height * displayObject.anchor.y;

            if (this._localPoint.y >= y1 && this._localPoint.y < y1 + height) {
                return true;
            }
        }
    }
    else if (displayObject instanceof PIXI.Sprite) {
        var width = displayObject.texture.frame.width / displayObject.texture.baseTexture.resolution;
        var height = displayObject.texture.frame.height / displayObject.texture.baseTexture.resolution;;
        var x1 = -width * displayObject.anchor.x;

        if (this._localPoint.x >= x1 && this._localPoint.x < x1 + width) {
            var y1 = -height * displayObject.anchor.y;

            if (this._localPoint.y >= y1 && this._localPoint.y < y1 + height) {
                return true;
            }
        }
    }
    else if (displayObject instanceof Phaser.Graphics) {
        for (var i = 0; i < displayObject.graphicsData.length; i++) {
            var data = displayObject.graphicsData[i];

            if (!data.fill) {
                continue;
            }

            //  Only deal with fills..
            if (data.shape && data.shape.contains(this._localPoint.x, this._localPoint.y)) {
                return true;
            }
        }
    }

    //  Didn't hit the parent, does it have any children?

    for (var i = 0, len = displayObject.children.length; i < len; i++) {
        if (this.hitTest(displayObject.children[i], pointer, localPoint)) {
            return true;
        }
    }

    return false;
}

/**
 * The width of the display object, taking resolution into account
 *
 * @property realHeight
 * @type Number
 */
Object.defineProperty(PIXI.DisplayObject.prototype, 'realWidth', {

    get: function() {
        return this.scale.x * this.texture.frame.width / this.texture.baseTexture.resolution;
    }

});

/**
 * The height of the display object, taking resolution into account
 *
 * @property realHeight
 * @type Number
 */
Object.defineProperty(PIXI.DisplayObject.prototype, 'realHeight', {

    get: function() {
        return this.scale.y * this.texture.frame.height / this.texture.baseTexture.resolution;
    }

});


/** TILEMAP SUPPORT **/
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Tile set is a combination of an image containing the tiles and collision data per tile.
*
* Tilesets are normally created automatically when Tiled data is loaded.
*
* @class Phaser.Tileset
* @constructor
* @param {string} name - The name of the tileset in the map data.
* @param {integer} firstgid - The first tile index this tileset contains.
* @param {integer} [width=32] - Width of each tile (in pixels).
* @param {integer} [height=32] - Height of each tile (in pixels).
* @param {integer} [margin=0] - The margin around all tiles in the sheet (in pixels).
* @param {integer} [spacing=0] - The spacing between each tile in the sheet (in pixels).
* @param {object} [properties={}] - Custom Tileset properties.
*/
Phaser.Tileset = function(name, firstgid, width, height, margin, spacing, properties, resolution) {
    if (width === undefined || width <= 0) { width = 32; }
    if (height === undefined || height <= 0) { height = 32; }
    if (margin === undefined) { margin = 0; }
    if (spacing === undefined) { spacing = 0; }
    if (resolution === undefined) { resolution = 1; }

    /**
    * The name of the Tileset.
    * @property {string} name
    */
    this.name = name;

    /**
    * The Tiled firstgid value.
    * This is the starting index of the first tile index this Tileset contains.
    * @property {integer} firstgid
    */
    this.firstgid = firstgid | 0;

    /**
    * The width of each tile (in pixels).
    * @property {integer} tileWidth
    * @readonly
    */
    this.tileWidth = width | 0;

    /**
    * The height of each tile (in pixels).
    * @property {integer} tileHeight
    * @readonly
    */
    this.tileHeight = height | 0;

    /**
    * The margin around the tiles in the sheet (in pixels).
    * Use `setSpacing` to change.
    * @property {integer} tileMarge
    * @readonly
    */
    // Modified internally
    this.tileMargin = margin | 0;

    /**
    * The spacing between each tile in the sheet (in pixels).
    * Use `setSpacing` to change.
    * @property {integer} tileSpacing
    * @readonly
    */
    this.tileSpacing = spacing | 0;


    /**
    * The resoliution of the tileset
    * @property {integer} resolution
    * @readonly
    */
    this.resolution = resolution | 1;

    /**
    * Tileset-specific properties that are typically defined in the Tiled editor.
    * @property {object} properties
    */
    this.properties = properties || {};

    /**
    * The cached image that contains the individual tiles. Use {@link Phaser.Tileset.setImage setImage} to set.
    * @property {?object} image
    * @readonly
    */
    // Modified internally
    this.image = null;

    /**
    * The number of tile rows in the the tileset.
    * @property {integer}
    * @readonly
    */
    // Modified internally
    this.rows = 0;

    /**
    * The number of tile columns in the tileset.
    * @property {integer} columns
    * @readonly
    */
    // Modified internally
    this.columns = 0;

    /**
    * The total number of tiles in the tileset.
    * @property {integer} total
    * @readonly
    */
    // Modified internally
    this.total = 0;

    /**
    * The look-up table to specific tile image offsets.
    * The coordinates are interlaced such that it is [x0, y0, x1, y1 .. xN, yN] and the tile with the index of firstgid is found at indices 0/1.
    * @property {integer[]} drawCoords
    * @private
    */
    this.drawCoords = [];
};

Phaser.Tileset.prototype = {

    /**
    * Draws a tile from this Tileset at the given coordinates on the context.
    *
    * @method Phaser.Tileset#draw
    * @public
    * @param {CanvasRenderingContext2D} context - The context to draw the tile onto.
    * @param {number} x - The x coordinate to draw to.
    * @param {number} y - The y coordinate to draw to.
    * @param {integer} index - The index of the tile within the set to draw.
    */
    draw: function(context, x, y, index) {

        //  Correct the tile index for the set and bias for interlacing
        var coordIndex = (index - this.firstgid) << 1;

        if (coordIndex >= 0 && (coordIndex + 1) < this.drawCoords.length) {
            context.drawImage(
                this.image,
                this.drawCoords[coordIndex] * this.resolution,
                this.drawCoords[coordIndex + 1] * this.resolution,
                this.tileWidth * this.resolution,
                this.tileHeight * this.resolution,
                x,
                y,
                this.tileWidth,
                this.tileHeight
            );
        }

    },

    /**
    * Returns true if and only if this tileset contains the given tile index.
    *
    * @method Phaser.Tileset#containsTileIndex
    * @public
    * @return {boolean} True if this tileset contains the given index.
    */
    containsTileIndex: function(tileIndex) {

        return (
            tileIndex >= this.firstgid &&
            tileIndex < (this.firstgid + this.total)
        );

    },

    /**
    * Set the image associated with this Tileset and update the tile data.
    *
    * @method Phaser.Tileset#setImage
    * @public
    * @param {Image} image - The image that contains the tiles.
    */
    setImage: function(image, resolution) {
        if (resolution === undefined) { resolution = 1; }
        this.resolution = resolution;
        this.image = image;
        this.updateTileData(image.width / this.resolution, image.height / this.resolution);
    },

    /**
    * Sets tile spacing and margins.
    *
    * @method Phaser.Tileset#setSpacing
    * @public
    * @param {integer} [margin=0] - The margin around the tiles in the sheet (in pixels).
    * @param {integer} [spacing=0] - The spacing between the tiles in the sheet (in pixels).
    */
    setSpacing: function(margin, spacing) {

        this.tileMargin = margin | 0;
        this.tileSpacing = spacing | 0;

        if (this.image) {
            this.updateTileData(this.image.width / this.resolution, this.image.height / this.resolution);
        }

    },

    /**
    * Updates tile coordinates and tileset data.
    *
    * @method Phaser.Tileset#updateTileData
    * @private
    * @param {integer} imageWidth - The (expected) width of the image to slice.
    * @param {integer} imageHeight - The (expected) height of the image to slice.
    */
    updateTileData: function(imageWidth, imageHeight) {
        // May be fractional values
        var rowCount = (imageHeight - this.tileMargin * 2 + this.tileSpacing) / (this.tileHeight + this.tileSpacing);
        var colCount = (imageWidth - this.tileMargin * 2 + this.tileSpacing) / (this.tileWidth + this.tileSpacing);

        if (rowCount % 1 !== 0 || colCount % 1 !== 0) {
            console.warn("Phaser.Tileset - image tile area is not an even multiple of tile size");
        }

        // In Tiled a tileset image that is not an even multiple of the tile dimensions
        // is truncated - hence the floor when calculating the rows/columns.
        rowCount = Math.floor(rowCount);
        colCount = Math.floor(colCount);
        //console.log(this.rows, rowCount);


        if ((this.rows && this.rows !== rowCount) || (this.columns && this.columns !== colCount)) {
            console.warn("Phaser.Tileset - actual and expected number of tile rows and columns differ");
        }

        this.rows = rowCount;
        this.columns = colCount;
        this.total = rowCount * colCount;

        this.drawCoords.length = 0;

        var tx = this.tileMargin;
        var ty = this.tileMargin;

        for (var y = 0; y < this.rows; y++) {
            for (var x = 0; x < this.columns; x++) {
                this.drawCoords.push(tx);
                this.drawCoords.push(ty);
                tx += this.tileWidth + this.tileSpacing;
            }

            tx = this.tileMargin;
            ty += this.tileHeight + this.tileSpacing;
        }

    }

};

Phaser.Tileset.prototype.constructor = Phaser.Tileset;


Phaser.Tilemap.prototype.addTilesetImage = function(tileset, key, resolution, tileWidth, tileHeight, tileMargin, tileSpacing, gid) {

    if (tileset === undefined) { return null; }
    if (resolution === undefined) { resolution = 1; }
    if (tileWidth === undefined) { tileWidth = this.tileWidth; }
    if (tileHeight === undefined) { tileHeight = this.tileHeight; }
    if (tileMargin === undefined) { tileMargin = 0; }
    if (tileSpacing === undefined) { tileSpacing = 0; }
    if (gid === undefined) { gid = 0; }

    //  In-case we're working from a blank map
    if (tileWidth === 0) {
        tileWidth = 32;
    }

    if (tileHeight === 0) {
        tileHeight = 32;
    }

    var img = null;

    if (key === undefined || key === null) {
        key = tileset;
    }

    if (key instanceof Phaser.BitmapData) {
        img = key.canvas;
    }
    else {
        if (!this.game.cache.checkImageKey(key)) {
            console.warn('Phaser.Tilemap.addTilesetImage: Invalid image key given: "' + key + '"');
            return null;
        }

        img = this.game.cache.getImage(key);
    }

    var idx = this.getTilesetIndex(tileset);

    if (idx === null && this.format === Phaser.Tilemap.TILED_JSON) {
        console.warn('Phaser.Tilemap.addTilesetImage: No data found in the JSON matching the tileset name: "' + tileset + '"');
        return null;
    }

    if (this.tilesets[idx]) {
        this.tilesets[idx].setImage(img, resolution);
        return this.tilesets[idx];
    }
    else {
        var newSet = new Phaser.Tileset(tileset, gid, tileWidth, tileHeight, tileMargin, tileSpacing, {}, resolution);

        newSet.setImage(img);

        this.tilesets.push(newSet);

        var i = this.tilesets.length - 1;
        var x = tileMargin;
        var y = tileMargin;

        var count = 0;
        var countX = 0;
        var countY = 0;

        for (var t = gid; t < gid + newSet.total; t++) {
            this.tiles[t] = [x, y, i];

            x += tileWidth + tileSpacing;

            count++;

            if (count === newSet.total) {
                break;
            }

            countX++;

            if (countX === newSet.columns) {
                x = tileMargin;
                y += tileHeight + tileSpacing;

                countX = 0;
                countY++;

                if (countY === newSet.rows) {
                    break;
                }
            }
        }
        return newSet;
    }
}

Phaser.TilemapParser.parseTiledJSON = function(json) {

    if (json.orientation !== 'orthogonal') {
        console.warn('TilemapParser.parseTiledJSON - Only orthogonal map types are supported in this version of Phaser');
        return null;
    }

    //  Map data will consist of: layers, objects, images, tilesets, sizes
    var map = {};

    map.width = json.width;
    map.height = json.height;
    map.tileWidth = json.tilewidth;
    map.tileHeight = json.tileheight;
    map.orientation = json.orientation;
    map.format = Phaser.Tilemap.TILED_JSON;
    map.version = json.version;
    map.properties = json.properties;
    map.widthInPixels = map.width * map.tileWidth;
    map.heightInPixels = map.height * map.tileHeight;

    //  Tile Layers
    var layers = [];

    for (var i = 0; i < json.layers.length; i++) {
        if (json.layers[i].type !== 'tilelayer') {
            continue;
        }

        var curl = json.layers[i];

        // Base64 decode data if necessary
        // NOTE: uncompressed base64 only. 
        if (!curl.compression && curl.encoding && curl.encoding === "base64") {
            var binaryString = window.atob(curl.data);
            var len = binaryString.length;
            var bytes = new Array(len);
            // Interpret binaryString as an array of bytes representing
            // little-endian encoded uint32 values. 
            for (var j = 0; j < len; j += 4) {
                bytes[j / 4] = (binaryString.charCodeAt(j) |
                    binaryString.charCodeAt(j + 1) << 8 |
                    binaryString.charCodeAt(j + 2) << 16 |
                    binaryString.charCodeAt(j + 3) << 24) >>> 0;
            }
            curl.data = bytes;
        }


        var layer = {

            name: curl.name,
            x: curl.x,
            y: curl.y,
            width: curl.width,
            height: curl.height,
            widthInPixels: curl.width * json.tilewidth,
            heightInPixels: curl.height * json.tileheight,
            alpha: curl.opacity,
            visible: curl.visible,
            properties: {},
            indexes: [],
            callbacks: [],
            bodies: []

        };

        if (curl.properties) {
            layer.properties = curl.properties;
        }

        var x = 0;
        var row = [];
        var output = [];
        var rotation, flipped, flippedVal, gid;

        //  Loop through the data field in the JSON.

        //  This is an array containing the tile indexes, one after the other. -1 = no tile, everything else = the tile index (starting at 1 for Tiled, 0 for CSV)
        //  If the map contains multiple tilesets then the indexes are relative to that which the set starts from.
        //  Need to set which tileset in the cache = which tileset in the JSON, if you do this manually it means you can use the same map data but a new tileset.

        for (var t = 0, len = curl.data.length; t < len; t++) {
            rotation = 0;
            flipped = false;
            gid = curl.data[t];

            //  If true the current tile is flipped or rotated (Tiled TMX format) 
            if (gid > 0x20000000) {
                flippedVal = 0;

                // FlippedX
                if (gid > 0x80000000) {
                    gid -= 0x80000000;
                    flippedVal += 4;
                }

                // FlippedY
                if (gid > 0x40000000) {
                    gid -= 0x40000000;
                    flippedVal += 2;
                }

                // FlippedAD
                if (gid > 0x20000000) {
                    gid -= 0x20000000;
                    flippedVal += 1;
                }

                switch (flippedVal) {
                    case 5:
                        rotation = Math.PI / 2;
                        break;
                    case 6:
                        rotation = Math.PI;
                        break;
                    case 3:
                        rotation = 3 * Math.PI / 2;
                        break;
                    case 4:
                        rotation = 0;
                        flipped = true;
                        break;
                    case 7:
                        rotation = Math.PI / 2;
                        flipped = true;
                        break;
                    case 2:
                        rotation = Math.PI;
                        flipped = true;
                        break;
                    case 1:
                        rotation = 3 * Math.PI / 2;
                        flipped = true;
                        break;
                }
            }

            //  index, x, y, width, height
            if (gid > 0) {
                row.push(new Phaser.Tile(layer, gid, x, output.length, json.tilewidth, json.tileheight));
                row[row.length - 1].rotation = rotation;
                row[row.length - 1].flipped = flipped;
            }
            else {
                if (Phaser.TilemapParser.INSERT_NULL) {
                    row.push(null);
                }
                else {
                    row.push(new Phaser.Tile(layer, -1, x, output.length, json.tilewidth, json.tileheight));
                }
            }

            x++;

            if (x === curl.width) {
                output.push(row);
                x = 0;
                row = [];
            }
        }

        layer.data = output;

        layers.push(layer);

    }

    map.layers = layers;

    //  Images
    var images = [];

    for (var i = 0; i < json.layers.length; i++) {
        if (json.layers[i].type !== 'imagelayer') {
            continue;
        }

        var curi = json.layers[i];

        var image = {

            name: curi.name,
            image: curi.image,
            x: curi.x,
            y: curi.y,
            alpha: curi.opacity,
            visible: curi.visible,
            properties: {}

        };

        if (curi.properties) {
            image.properties = curi.properties;
        }

        images.push(image);

    }

    map.images = images;

    //  Tilesets & Image Collections
    var tilesets = [];
    var imagecollections = [];

    for (var i = 0; i < json.tilesets.length; i++) {
        //  name, firstgid, width, height, margin, spacing, properties
        var set = json.tilesets[i];

        if (set.image) {
            var newSet = new Phaser.Tileset(set.name, set.firstgid, set.tilewidth, set.tileheight, set.margin, set.spacing, set.properties);

            if (set.tileproperties) {
                newSet.tileProperties = set.tileproperties;
            }

            // For a normal sliced tileset the row/count/size information is computed when updated.
            // This is done (again) after the image is set.
            newSet.updateTileData(set.imagewidth, set.imageheight);
            tilesets.push(newSet);
        }
        else {
            var newCollection = new Phaser.ImageCollection(set.name, set.firstgid, set.tilewidth, set.tileheight, set.margin, set.spacing, set.properties);

            for (var ti in set.tiles) {
                var image = set.tiles[ti].image;
                var gid = set.firstgid + parseInt(ti, 10);
                newCollection.addImage(gid, image);
            }

            imagecollections.push(newCollection);
        }

    }

    map.tilesets = tilesets;
    map.imagecollections = imagecollections;

    //  Objects & Collision Data (polylines, etc)
    var objectLayerProperties = {};
    var objects = {};
    var collision = {};

    function slice(obj, fields) {

        var sliced = {};

        for (var k in fields) {
            var key = fields[k];

            if (typeof obj[key] !== 'undefined') {
                sliced[key] = obj[key];
            }
        }

        return sliced;
    }

    for (var i = 0; i < json.layers.length; i++) {
        if (json.layers[i].type !== 'objectgroup') {
            continue;
        }

        var curo = json.layers[i];
        if (curo.properties !== undefined) {
            objectLayerProperties[curo.name] = {};
            var keys = Object.keys(curo.properties);
            for (var ii = 0; ii < keys.length; ii++) {
                objectLayerProperties[curo.name][keys[ii]] = curo.properties[keys[ii]];
            }
        }

        objects[curo.name] = [];
        collision[curo.name] = [];

        for (var v = 0, len = curo.objects.length; v < len; v++) {
            //  Object Tiles
            if (curo.objects[v].gid) {
                var object = {

                    gid: curo.objects[v].gid,
                    name: curo.objects[v].name,
                    type: curo.objects[v].hasOwnProperty("type") ? curo.objects[v].type : "",
                    x: curo.objects[v].x,
                    y: curo.objects[v].y,
                    visible: curo.objects[v].visible,
                    properties: curo.objects[v].properties

                };

                if (curo.objects[v].rotation) {
                    object.rotation = curo.objects[v].rotation;
                }

                objects[curo.name].push(object);
            }
            else if (curo.objects[v].polyline) {
                var object = {
                    
                    name: curo.objects[v].name,
                    type: curo.objects[v].type,
                    x: curo.objects[v].x,
                    y: curo.objects[v].y,
                    width: curo.objects[v].width,
                    height: curo.objects[v].height,
                    visible: curo.objects[v].visible,
                    properties: curo.objects[v].properties

                };

                if (curo.objects[v].rotation) {
                    object.rotation = curo.objects[v].rotation;
                }

                object.polyline = [];

                //  Parse the polyline into an array
                for (var p = 0; p < curo.objects[v].polyline.length; p++) {
                    object.polyline.push([curo.objects[v].polyline[p].x, curo.objects[v].polyline[p].y]);
                }

                collision[curo.name].push(object);
                objects[curo.name].push(object);
            }
            // polygon
            else if (curo.objects[v].polygon) {
                var object = slice(curo.objects[v],
                    ["name", "type", "x", "y", "visible", "rotation", "properties"]);

                //  Parse the polygon into an array
                object.polygon = [];

                for (var p = 0; p < curo.objects[v].polygon.length; p++) {
                    object.polygon.push([curo.objects[v].polygon[p].x, curo.objects[v].polygon[p].y]);
                }

                objects[curo.name].push(object);

            }
            // ellipse
            else if (curo.objects[v].ellipse) {
                var object = slice(curo.objects[v],
                    ["name", "type", "ellipse", "x", "y", "width", "height", "visible", "rotation", "properties"]);
                objects[curo.name].push(object);
            }
            // otherwise it's a rectangle
            else {
                var object = slice(curo.objects[v],
                    ["name", "type", "x", "y", "width", "height", "visible", "rotation", "properties"]);
                object.rectangle = true;
                objects[curo.name].push(object);
            }
        }
    }

    map.objectLayerProperties = objectLayerProperties;
    map.objects = objects;
    map.collision = collision;

    map.tiles = [];

    //  Finally lets build our super tileset index
    for (var i = 0; i < map.tilesets.length; i++) {
        var set = map.tilesets[i];

        var x = set.tileMargin;
        var y = set.tileMargin;

        var count = 0;
        var countX = 0;
        var countY = 0;

        for (var t = set.firstgid; t < set.firstgid + set.total; t++) {
            //  Can add extra properties here as needed
            map.tiles[t] = [x, y, i];

            x += set.tileWidth + set.tileSpacing;

            count++;

            if (count === set.total) {
                break;
            }

            countX++;

            if (countX === set.columns) {
                x = set.tileMargin;
                y += set.tileHeight + set.tileSpacing;

                countX = 0;
                countY++;

                if (countY === set.rows) {
                    break;
                }
            }
        }

    }

    // assign tile properties

    var layer;
    var tile;
    var sid;
    var set;

    // go through each of the map layers
    for (var i = 0; i < map.layers.length; i++) {
        layer = map.layers[i];

        // rows of tiles
        for (var j = 0; j < layer.data.length; j++) {
            row = layer.data[j];

            // individual tiles
            for (var k = 0; k < row.length; k++) {
                tile = row[k];

                if (tile === null || tile.index < 0) {
                    continue;
                }

                // find the relevant tileset

                sid = map.tiles[tile.index][2];
                set = map.tilesets[sid];

                // if that tile type has any properties, add them to the tile object

                if (set.tileProperties && set.tileProperties[tile.index - set.firstgid]) {
                    tile.properties = Phaser.Utils.mixin(set.tileProperties[tile.index - set.firstgid], tile.properties);
                }
            }
        }
    }

    return map;
}

Phaser.Tilemap.prototype.getObjectLayerProps = function(name) {
    return this.objectLayerProperties[name]  === undefined ?  null : this.objectLayerProperties[name];
}

var tilemapprototype = Phaser.Tilemap.prototype;

Phaser.Tilemap = function(game, key, tileWidth, tileHeight, width, height) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = game;

    /**
    * @property {string} key - The key of this map data in the Phaser.Cache.
    */
    this.key = key;

    var data = Phaser.TilemapParser.parse(this.game, key, tileWidth, tileHeight, width, height);

    if (data === null) {
        return;
    }

    /**
    * @property {number} width - The width of the map (in tiles).
    */
    this.width = data.width;

    /**
    * @property {number} height - The height of the map (in tiles).
    */
    this.height = data.height;

    /**
    * @property {number} tileWidth - The base width of the tiles in the map (in pixels).
    */
    this.tileWidth = data.tileWidth;

    /**
    * @property {number} tileHeight - The base height of the tiles in the map (in pixels).
    */
    this.tileHeight = data.tileHeight;

    /**
    * @property {string} orientation - The orientation of the map data (as specified in Tiled), usually 'orthogonal'.
    */
    this.orientation = data.orientation;

    /**
    * @property {number} format - The format of the map data, either Phaser.Tilemap.CSV or Phaser.Tilemap.TILED_JSON.
    */
    this.format = data.format;

    /**
    * @property {number} version - The version of the map data (as specified in Tiled, usually 1).
    */
    this.version = data.version;

    /**
    * @property {object} properties - Map specific properties as specified in Tiled.
    */
    this.properties = data.properties;

    /**
    * @property {number} widthInPixels - The width of the map in pixels based on width * tileWidth.
    */
    this.widthInPixels = data.widthInPixels;

    /**
    * @property {number} heightInPixels - The height of the map in pixels based on height * tileHeight.
    */
    this.heightInPixels = data.heightInPixels;

    /**
    * @property {array} layers - An array of Tilemap layer data.
    */
    this.layers = data.layers;

    /**
    * @property {array} tilesets - An array of Tilesets.
    */
    this.tilesets = data.tilesets;

    /**
    * @property {array} imagecollections - An array of Image Collections.
    */
    this.imagecollections = data.imagecollections;

    /**
    * @property {array} tiles - The super array of Tiles.
    */
    this.tiles = data.tiles;

    /**
    * @property {array} objects - An array of Tiled Object Layers.
    */
    this.objects = data.objects;

    this.objectLayerProperties = data.objectLayerProperties;

    /**
    * @property {array} collideIndexes - An array of tile indexes that collide.
    */
    this.collideIndexes = [];

    /**
    * @property {array} collision - An array of collision data (polylines, etc).
    */
    this.collision = data.collision;

    /**
    * @property {array} images - An array of Tiled Image Layers.
    */
    this.images = data.images;

    /**
    * @property {number} currentLayer - The current layer.
    */
    this.currentLayer = 0;

    /**
    * @property {array} debugMap - Map data used for debug values only.
    */
    this.debugMap = [];

    /**
    * @property {array} _results - Internal var.
    * @private
    */
    this._results = [];

    /**
    * @property {number} _tempA - Internal var.
    * @private
    */
    this._tempA = 0;

    /**
    * @property {number} _tempB - Internal var.
    * @private
    */
    this._tempB = 0;

};
Phaser.Tilemap.CSV = 0;
Phaser.Tilemap.TILED_JSON = 1;
Phaser.Tilemap.NORTH = 0;
Phaser.Tilemap.EAST = 1;
Phaser.Tilemap.SOUTH = 2;
Phaser.Tilemap.WEST = 3;
Phaser.Tilemap.prototype = tilemapprototype;