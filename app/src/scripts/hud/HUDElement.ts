import {Sprite} from 'dijon/display';

// Structure of a the visual properties for a specific HUD element.
export interface IHUDElementProperties {
    scale: { x: number, y: number };
    anchor: { x: number, y: number };
    texture: string;
    key: string;
    textStyle: { font: string, size: number, color: string };
    barScaling: { x: number, y: number };
    maxSize: number;
}

export interface IStat {
    min: number;
    current: number;
    next: number;
    max: number;
}

export class HUDElement extends Sprite {
    constructor(name: string, properties: any) {
        super(0, 0, properties.texture, null, name);

        if (properties.scale !== undefined) {
             this.scale = new Phaser.Point(properties.scale.x, properties.scale.y)
        }        
        if (properties.anchor !== undefined) {
            this.anchor = new Phaser.Point(properties.anchor.x, properties.anchor.y);
        }

        this._parseProperties(properties);
    }

    protected _parseProperties(properties: IHUDElementProperties): void {
        // Override in extended classes to access additional properties
    }

    // This should only be called when a stat changes.    
    public updateElement(newStat: IStat): void {
        // Update this element based on new value
    }

    public reposition(x: number, y: number): void {
        this.x = x - this.parent.x;
        this.y = y - this.parent.y;
    }
}