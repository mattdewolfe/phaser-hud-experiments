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
        let horizontalWidth = (camWidth - (hudMargins.right + hudMargins.left)) / 3;
        let middleWidth = camWidth * 0.1;
        let middleHeight = camHeight - (hudMargins.bottom + hudMargins.top);
        // Top Element Regions
        this.topLeft = new SingleRegion(hudMargins.left, hudMargins.top,
            horizontalWidth, 0, "TopLeft");
        this.topCenter = new SingleRegion(camCenter.x - (horizontalWidth * 0.5), this.topLeft.y,
            horizontalWidth, 0, "TopCenter"); 
        this.topRight = new SingleRegion(camWidth - hudMargins.right - horizontalWidth, this.topCenter.y,
            horizontalWidth, 0, "TopRight");

        // Bottom Element Regions
        this.bottomLeft = new SingleRegion(hudMargins.left, camHeight - hudMargins.bottom,
            horizontalWidth, 0, "BottomLeft");
        this.bottomCenter = new SingleRegion(this.bottomLeft.endX, this.bottomLeft.y,
            horizontalWidth, 0, "BottomCenter");
        this.bottomRight = new SingleRegion(this.bottomCenter.endX, this.bottomCenter.y,
            horizontalWidth, 0, "BottomRight");

        // Middle Element Regions
        this.middleLeft = new SingleRegion(hudMargins.left, this.topLeft.endY,
            0, this.bottomLeft.y - this.topLeft.endY, "MiddleLeft");
        this.middleRight = new SingleRegion(camWidth - hudMargins.right, this.topRight.endY,
            0, this.bottomRight.y - this.topRight.endY, "MiddleRight");
        this.middleCenter = new SingleRegion(hudMargins.left, camCenter.y, 
            camWidth - (hudMargins.right + hudMargins.left), 0, "MiddleCenter");
        
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

    public updateAllElementPositions(): void {
        this.topLeft.updateAllElementPositions();
        this.topCenter.updateAllElementPositions();
        this.topRight.updateAllElementPositions();
        this.middleLeft.updateAllElementPositions();
        this.middleCenter.updateAllElementPositions();
        this.middleRight.updateAllElementPositions();
        this.bottomLeft.updateAllElementPositions();
        this.bottomCenter.updateAllElementPositions();
        this.bottomRight.updateAllElementPositions();
    }
    
}

class SingleRegion extends Group {
    public end: Phaser.Point;
    public elements: HUDElement[];
    public regionWidth: number;
    public regionHeight: number;
    
    constructor(x: number, y: number, width: number, height: number, name: string) {
        super(x, y, name);
        this.elements = [];
        this.regionWidth = width;
        this.regionHeight = height;
        this._addDebugBox();
    }

    protected _addDebugBox(): void {
        let gfx = this.game.add.graphics();
        gfx.beginFill(Phaser.Color.getRandomColor(35, 100), 0.7);
        gfx.drawRect(0, 0, this.regionWidth > 1 ? this.regionWidth : 2, this.regionHeight > 1 ? this.regionHeight : 2);
        gfx.endFill();
        this.addChild(new Phaser.Image(this.game, 0, 0, gfx.generateTexture()));
        this.game.world.remove(gfx);
    } 

    public updateAllElementPositions(): void {
        let number_of_elements, step, position;
        number_of_elements = this.elements.length;
        if (number_of_elements === 1) {
            // if there is only one element, it should be in the center of the region
            this.elements[0].reposition(this.x + (this.regionWidth / 2), this.y + (this.regionHeight / 2));
        } else if (number_of_elements === 2) {
            // if there are two elements, they will be in opposite sides of the region
            this.elements[0].reposition(this.x + (this.regionWidth * 0.25), this.y + (this.regionHeight * 0.25));
            this.elements[1].reposition(this.x + (this.regionWidth * 0.75) - this.elements[1].realWidth, this.y + (this.regionHeight * 0.75));
        } else if (number_of_elements > 2) {
            // if there are more than two elements, they will be equally spaced in the region
            step = new Phaser.Point(this.regionWidth / number_of_elements, this.regionHeight / number_of_elements);
            position = new Phaser.Point(this.x + (step.x * 0.5), this.y + (step.y * 0.5));
            this.elements.forEach(function (element) {
                element.reposition(position.x, position.y);
                position.x += step.x;
                position.y += step.y;
            }, this);
        }
        
        // fix all elements to camera
        this.elements.forEach(function (element) {
            element.fixedToCamera = true;
        }, this);    
    } 

    protected randomColor(): number {
        return 0x0f0f + Math.round(Math.random() * 10);   
    }   
    
    public get centerX(): number {
        return this.x + (this.regionWidth * 0.5);
    }    

    public get centerY(): number {
        return this.y + (this.regionHeight * 0.5);
    }
    
    public get endX(): number {
        return this.x + this.regionWidth;
    }

    public get endY(): number {
        return this.y + this.regionHeight;
    }
    
    public addElement(newElement: HUDElement): void {
        this.addChild(newElement);
        this.elements.push(newElement);
    }
}