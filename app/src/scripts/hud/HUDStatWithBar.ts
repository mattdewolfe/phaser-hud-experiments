import {IHUDElementProperties, IStat, HUDElement} from './HUDElement';

export default class HUDStatWithBar extends HUDElement {
    protected _barBackground: Phaser.Sprite;
    protected _scaleVector: Phaser.Point;
    protected _maxSize: number = 50;
    
    constructor(name: string, x: number, y: number, properties: any) {
        super(name, x, y, properties);
    }

    protected _parseProperties(properties: IHUDElementProperties): void {
        if (properties.barScaling !== undefined) {
            this._scaleVector = new Phaser.Point(properties.barScaling.x, properties.barScaling.y);
        }
        if (properties.maxSize !== undefined) {
            this._maxSize = properties.maxSize;
        }
    }

    public updateElement(newStat: IStat): void {
        let newScale: number = (newStat.current / newStat.max) * this._maxSize;
        this.scale.setTo(this._scaleVector.x * newScale, this._scaleVector.y * newScale);
    }
}