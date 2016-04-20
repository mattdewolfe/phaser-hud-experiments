import {HUDElement} from './HUDElement';
import HUD from './HUD';
import {Group} from 'dijon/display';

export interface IMarginData {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

export default class HUDRegions {
    public topLeft: SingleRegion;
    public topCenter: SingleRegion;
    public topRight: SingleRegion;
    public middleLeft: SingleRegion;
    public middleCenter: SingleRegion;
    public middleRight: SingleRegion;
    public bottomLeft: SingleRegion;
    public bottomCenter: SingleRegion;
    public bottomRight: SingleRegion;
    
    constructor(hud: HUD, camWidth: number, camHeight: number, camCenter: Phaser.Point, hudMargins: IMarginData) {
        // define the HUD regions (begin and end points)
        this.topLeft = new SingleRegion(hudMargins.left, hudMargins.top,
            (camWidth / 3) - hudMargins.right, hudMargins.top, "TopLeft");
        this.topCenter = new SingleRegion((camWidth / 3) + hudMargins.left, hudMargins.top,
            (2 * camWidth / 3) - hudMargins.right, hudMargins.top, "TopCenter"); 
        this.topRight = new SingleRegion((2 * camWidth / 3) + hudMargins.left, hudMargins.top,
            camWidth - hudMargins.right, hudMargins.top, "TopRight");
        this.middleLeft = new SingleRegion(hudMargins.left, (camHeight / 3) + hudMargins.top,
            hudMargins.left, (2 * camHeight / 3) - hudMargins.bottom, "MiddleLeft");
        this.middleCenter = new SingleRegion((camWidth / 3) + hudMargins.left, camCenter.y,
            (2 * camWidth / 3) - hudMargins.right, camCenter.y, "MiddleCenter");
        this.middleRight = new SingleRegion(camWidth - hudMargins.right, (camHeight / 3) + hudMargins.top,
            camWidth - hudMargins.right, (2 * camHeight / 3) + hudMargins.top, "MiddleRight");
        this.bottomLeft = new SingleRegion(hudMargins.left, camHeight - hudMargins.bottom,
            (camWidth / 3) - hudMargins.right, camHeight - hudMargins.bottom, "BottomLeft");
        this.bottomCenter = new SingleRegion((camWidth / 3) + hudMargins.left, camHeight - hudMargins.bottom,
            (2 * camWidth / 3) - hudMargins.right, camHeight - hudMargins.bottom, "BottomCenter");
        this.bottomRight = new SingleRegion((2 * camWidth / 3) + hudMargins.left, camHeight - hudMargins.bottom,
            camWidth - hudMargins.right, camHeight - hudMargins.bottom, "BottomRight");

        hud.addChild(this.topLeft);
        hud.addChild(this.topCenter);
        hud.addChild(this.topRight);
        hud.addChild(this.middleLeft);
        hud.addChild(this.middleCenter);
        hud.addChild(this.middleRight);
        hud.addChild(this.bottomLeft);
        hud.addChild(this.bottomCenter);
        hud.addChild(this.bottomRight);
    }
}

class SingleRegion extends Group {
    public begin: Phaser.Point;
    public end: Phaser.Point;
    public elements: HUDElement[];
    constructor(bX: number, bY: number, eX: number, eY: number, name: string) {
        super(bX, bY, name);
        this.begin = new Phaser.Point(bX, bY);
        this.end = new Phaser.Point(eX, eY);
        this._addDebugBox();
    }

    protected _addDebugBox(): void {
        let gfx = this.game.add.graphics();
        gfx.beginFill(0x00ff00, 0.5);
        gfx.drawRect(0, 0, this.end.x - this.begin.x, this.end.y - this.begin.y);
        gfx.endFill();
        this.addChild(new Phaser.Image(this.game, 0, 0, gfx.generateTexture()));
        this.game.world.remove(gfx);
    } 
    
    protected _updateElementPositions(): void {
        this.children.forEach(this._updateElementsInRegion, this);
        let region_dimensions, number_of_elements, step, position;
        region_dimensions = new Phaser.Point(region.end.x - region.begin.x, region.end.y - region.begin.y);
        number_of_elements = region.children.length;
        if (number_of_elements === 1) {
            // if there is only one element, it should be in the center of the region
            region.elements[0].reset(region.begin.x + (region_dimensions.x / 2), region.begin.y + (region_dimensions.y / 2));
        } else if (number_of_elements === 2) {
            // if there are two elements, they will be in opposite sides of the region
            region.elements[0].reset(region.begin.x, region.begin.y);
            region.elements[1].reset(region.end.x, region.end.y);
        } else if (number_of_elements > 2) {
            // if there are more than two elements, they will be equally spaced in the region
            step = new Phaser.Point(region_dimensions.x / number_of_elements, region_dimensions.y / number_of_elements);
            position = new Phaser.Point(region.begin.x, region.begin.y);
            region.elements.forEach(function (element) {
                element.reset(position.x, position.y);
                position.x += step.x;
                position.y += step.y;
            }, this);
        }
        
        // fix all elements to camera
        region.elements.forEach(function (element) {
            element.fixedToCamera = true;
        }, this);
    }
    
    public addElement(newElement: HUDElement): void {
        this.addChild(newElement);
    }
}