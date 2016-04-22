import Stat from './Stat';

export default class CharacterStats {
    public stats: any;
    constructor() { 
        this.stats = [];
    }

    public addStat(newStat: Stat): void {
        this.stats.push(newStat);
    }

    public findStat(type: string): Stat {
        for (let i = 0; i < this.stats.length; i++) {
            if (this.stats[i].type === type) {
                return this.stats[i];
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
}