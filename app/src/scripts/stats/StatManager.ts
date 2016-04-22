// Load in all stat possibilities at loadup.
import Stat from './Stat'; 
import HUD from '../hud/HUD';

export interface IStatData {
    min: number;
    max: number;
}

export class StatManager {
    private _statData: any;
    private _globalStats: Stat[];

    private static _currentID: number = 0;

    constructor(inData: any) {
        console.log(inData);
        this._globalStats = [];
        this._statData = {};
        this._statData = inData;
    }

    public getNewStat(type: string, objType: string): Stat {
        let newStat: Stat = new Stat();
        if (this._statData.hasOwnProperty(type)) {
            newStat.initWithData(this._statData[type], type, objType, StatManager._currentID);
            StatManager._currentID += 1;
        }
        return newStat;
    }

    public getStatsForCharacter(types: string[], objType: string): Stat[] {
        let stats: Stat[] = [];
        for (let i = 0; i < types.length; i++) {
            let newStat = this.getNewStat(types[i], objType);
            if (newStat.type !== "NONE") {
                stats.push(newStat);
                this._globalStats.push(newStat);
            }
        }
        return stats;
    }   

    public logAllStats(): void {
        console.log(this._globalStats);
    }
    
    public setHUD(hud: HUD): void {
        Stat.hud = hud;
    }
}