import HUD from '../hud/HUD';
import {IStatData} from './StatManager';

export default class Stat {
    protected _type: string = "NONE";
    protected _id: number;
    public min: number = 1;
    public max: number = 255;
    public current: number = 1;
    public next: number = 2;

    public static hud: HUD;

    constructor() {}
    
    public initWithData(data: IStatData, type: string, owningObj: string, id: number): void {
        this._type = owningObj + type;
        this._id = id;
        this.min = data.min;
        this.max = data.max;
        this.current = this.min;
        this.next = this.current + 1;
    }

    public get id(): number {
        return this._id;
    }    

    public get type(): string {
        return this._type;
    }
    
    public resetStat(newVal: number): void {
        this.current = newVal;
        this._clampAndNotifyHUD();
    }

    public alterStat(increaseBy: number): void {
        this.current += increaseBy;
        this._clampAndNotifyHUD();
    }

    protected _clampAndNotifyHUD(): void {
        if (this.current < this.min) {
            this.current = this.min;
        }
        else if (this.current > this.max) {
            this.current = this.max;
        }
        Stat.hud.notifyStatChange(this);
    }
}