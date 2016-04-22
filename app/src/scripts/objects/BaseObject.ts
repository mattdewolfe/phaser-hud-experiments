import {Sprite} from 'dijon/display';
import Stat from '../stats/Stat';

export interface ICharacterData {
    name: string;
    x: number;
    y: number;
    key: string;
    stats: string[];
}

export class BaseObject extends Sprite {
    protected _stats: Stat[];
    
    constructor(name: string, x: number, y: number, key: string) {
        super(x, y, key);
        this._stats = [];
        this.name = name;
    }

    public get stats(): Stat[] {
        return this._stats;
    }

    public addStat(newStat: Stat): void {
        this._stats.push(newStat);
    }

    public addAllStats(newStats: Stat[]): void {
        this._stats = newStats;    
    }
    
    public findStat(type: string): Stat {
        for (let i = 0; i < this._stats.length; i++) {
            if (this._stats[i].type === type) {
                return this._stats[i];
            }
        }
        console.error("Specified stat not found, returning an empty Stat");
        return new Stat();
    }

    public retrieveCurrentValue(type: string): number {
        return this.findStat(type).current;
    }

    public retrieveMaxValue(type: string): number {
        return this.findStat(type).max;
    }

    public retrieveMinValue(type: string): number {
        return this.findStat(type).min;
    }

    public resetStat(type: string, newValue: number): void {
        let stat = this.findStat(type);
        if (stat.type !== "EMPTY") {
            stat.resetStat(newValue);
        }
    }

    public alterStat(type: string, increaseBy: number): void {
        let stat = this.findStat(type);
        if (stat.type !== "EMPTY") {
            stat.alterStat(increaseBy);
        }
    }
}